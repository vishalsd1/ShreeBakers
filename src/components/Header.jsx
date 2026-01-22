import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";
import logo from "../assets/logo.jpg";

export default function Header({ currentPage, cartCount, onNavigate, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate("home")}
          >
            <img 
              src={logo} 
              alt="Shree Bakers Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform object-cover" 
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-chocolate tracking-tight group-hover:text-coral transition-colors">
                Shree Bakers
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">PHULAMBRI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate("home")} 
              className={`font-semibold text-sm transition ${currentPage === 'home' ? 'text-coral border-b-2 border-coral' : 'text-gray-700 hover:text-coral'}`}
            >
              {getTranslation("home", language)}
            </button>
            <button 
              onClick={() => onNavigate("order")} 
              className={`font-semibold text-sm transition ${currentPage === 'order' ? 'text-coral border-b-2 border-coral' : 'text-gray-700 hover:text-coral'}`}
            >
              {getTranslation("orderOnline", language)}
            </button>
            <button 
              onClick={() => onNavigate("track-order")} 
              className={`font-semibold text-sm transition ${currentPage === 'track-order' ? 'text-coral border-b-2 border-coral' : 'text-gray-700 hover:text-coral'}`}
            >
              Track Order
            </button>
            <button 
              onClick={() => onNavigate("contact")} 
              className={`font-semibold text-sm transition ${currentPage === 'contact' ? 'text-coral border-b-2 border-coral' : 'text-gray-700 hover:text-coral'}`}
            >
              {getTranslation("contact", language)}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-chocolate">Hi, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-coral transition"
              >
                <User size={18} />
                Login
              </button>
            )}

            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 rounded-full text-xs font-bold border border-gray-300 hover:border-coral hover:text-coral transition"
              >
                {language === 'en' ? 'मराठी' : 'English'}
              </button>

              <button 
                onClick={() => onNavigate("cart")} 
                className="relative p-2 hover:bg-gray-100 rounded-full transition group"
              >
                <ShoppingCart className={`w-6 h-6 ${currentPage === 'cart' ? 'text-coral fill-current' : 'text-gray-700 group-hover:text-coral'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => onNavigate("cart")} 
              className="relative p-2"
            >
              <ShoppingCart className={`w-6 h-6 ${currentPage === 'cart' ? 'text-coral' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-coral transition"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down absolute w-full shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => { onNavigate("home"); setIsMenuOpen(false); }} 
              className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentPage === 'home' ? 'bg-orange-50 text-coral' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {getTranslation("home", language)}
            </button>
            <button 
              onClick={() => { onNavigate("order"); setIsMenuOpen(false); }} 
              className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentPage === 'order' ? 'bg-orange-50 text-coral' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {getTranslation("orderOnline", language)}
            </button>
            <button 
              onClick={() => { onNavigate("track-order"); setIsMenuOpen(false); }} 
              className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentPage === 'track-order' ? 'bg-orange-50 text-coral' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Track Order
            </button>
            <button 
              onClick={() => { onNavigate("contact"); setIsMenuOpen(false); }} 
              className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition ${currentPage === 'contact' ? 'bg-orange-50 text-coral' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {getTranslation("contact", language)}
            </button>

            {user ? (
              <div className="border-t border-gray-100 pt-3 mt-2">
                <div className="px-4 py-2 font-bold text-chocolate">Hi, {user.name}</div>
                <button
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-red-500 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onNavigate("login"); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Login / Sign Up
              </button>
            )}

            <div className="border-t border-gray-100 pt-3 mt-2">
              <button 
                onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition"
              >
                {language === 'en' ? 'मराठी मध्ये बदला' : 'Switch to English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
