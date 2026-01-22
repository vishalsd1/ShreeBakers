import { useState, useEffect } from "react";
import { ArrowRight, Star, Clock, MapPin, Truck, Award, ThumbsUp, Loader } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";
import CustomerReviews from "./CustomerReviews";
import CakeCard from "./CakeCard";

export default function Home({ onNavigate, onAddToCart, onCakeClick }) {
  const { language } = useLanguage();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchFeaturedCakes();
  }, []);

  const fetchFeaturedCakes = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cakes`);
      if (response.ok) {
        const data = await response.json();
        // Get 3 random cakes or first 3
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setFeaturedCakes(shuffled.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching featured cakes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-chocolate to-[#8B4513] text-white py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-coral/20 text-coral-light px-4 py-1 rounded-full text-sm font-bold mb-4 sm:mb-6 border border-coral/30">
                {language === 'mr' ? 'फुलांब्री मध्ये फक्त डिलिव्हरी' : 'Delivery only within Phulambri'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                {getTranslation("welcomeTitle", language)} <br />
                <span className="text-coral text-3xl sm:text-5xl lg:text-6xl block mt-2">
                   {language === 'mr' ? 'तुमची आवडती बेकरी' : 'Your Favorite Bakery'}
                </span>
              </h1>
              <p className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                {getTranslation("welcomeSubtitle", language)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => onNavigate("order")}
                  className="bg-coral text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-coral/90 transition-all shadow-lg hover:shadow-coral/50 flex items-center justify-center gap-2 group"
                >
                  {getTranslation("shopNow", language)}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 transition-all"
                >
                  {getTranslation("contact", language)}
                </button>
              </div>
            </div>
            
            {/* Hero Image/Animation Placeholder */}
            <div className="flex-1 relative hidden md:block">
               <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-coral/20 rounded-full blur-3xl animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Delicious Cake" 
                    className="relative w-full h-full object-cover rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white/10"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cakes Section */}
      <div className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-chocolate mb-3 sm:mb-4">
              {language === 'mr' ? 'सर्वाधिक विक्री होणारे केक' : 'Bestseller Cakes'}
            </h2>
            <div className="w-20 h-1 bg-coral mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {language === 'mr' 
                ? 'आमच्या ग्राहकांचे आवडते केक जे प्रत्येक समारंभ खास बनवतात' 
                : 'Our most loved cakes that make every celebration special'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin text-coral" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredCakes.map(cake => (
                <CakeCard 
                  key={cake._id} 
                  cake={cake} 
                  onAddToCart={onAddToCart}
                  onClick={() => onCakeClick(cake)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate("order")}
              className="inline-flex items-center gap-2 text-chocolate font-bold hover:text-coral transition-colors border-b-2 border-transparent hover:border-coral"
            >
              {language === 'mr' ? 'सर्व केक पहा' : 'View All Cakes'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-chocolate mb-3 sm:mb-4">{getTranslation("whyChooseUs", language)}</h2>
            <div className="w-20 h-1 bg-coral mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Award className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? 'उत्तम गुणवत्ता' : 'Premium Quality'}
              desc={language === 'mr' ? 'आम्ही फक्त सर्वोत्तम घटक वापरतो' : 'We use only the finest ingredients'}
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? 'ताजे तयार केलेले' : 'Freshly Baked'}
              desc={language === 'mr' ? 'तुमच्या ऑर्डरनंतरच बनवले जाते' : 'Baked fresh only after you order'}
            />
            <FeatureCard
              icon={<Truck className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? 'जलद डिलिव्हरी' : 'Fast Delivery'}
              desc={language === 'mr' ? 'फुलांब्री मध्ये वेळेवर पोहोच' : 'On-time delivery within Phulambri'}
            />
            <FeatureCard
              icon={<ThumbsUp className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? '100% शाकाहारी' : '100% Eggless Options'}
              desc={language === 'mr' ? 'अंडी नसलेले केक उपलब्ध' : 'Delicious eggless cakes available'}
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? 'सानुकूल डिझाइन' : 'Custom Designs'}
              desc={language === 'mr' ? 'तुमच्या आवडीनुसार डिझाइन' : 'We make cakes as per your design'}
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-coral" />}
              title={language === 'mr' ? 'स्थानिक बेकरी' : 'Local Bakery'}
              desc={language === 'mr' ? 'तुमच्या जवळचे, तुमचे आपले' : 'Your trusted neighborhood bakery'}
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <CustomerReviews />

    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group">
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-chocolate mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{desc}</p>
    </div>
  );
}
