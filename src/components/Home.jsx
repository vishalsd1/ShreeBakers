import { MdCake, MdLocalShipping, MdStarRate } from "react-icons/md";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function Home({ onNavigate }) {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-peach to-coral text-white py-12 sm:py-20 lg:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            SHREE BAKERS & CAKE SHOP
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-8 opacity-95">
            {getTranslation("welcomeSubtitle", language)}
          </p>
          
          <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            {language === 'mr' 
              ? "आपल्या प्रत्येक क्षणाचे उदयापन आमच्या स्वादिष्ट, ताजे बेक केलेल्या केकने करा. जन्मदिन ते वर्षगणना, आमच्याकडे आपल्यासाठी विशेष काहीतरी आहे. फुलाम्बरी मध्ये केवळ वितरण उपलब्ध आहे."
              : "Celebrate every moment with our delicious, freshly baked cakes. From birthdays to anniversaries, we have something special for you. Available for delivery only within Phulambri."
            }
          </p>

          <button
            onClick={() => onNavigate("order")}
            className="bg-white text-coral px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            {getTranslation("shopNow", language)}
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chocolate text-center mb-8 sm:mb-12">
            {getTranslation("whyChooseUs", language)}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <MdCake className="text-5xl sm:text-6xl text-coral mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-chocolate mb-3">{getTranslation("bestIngredients", language)}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {getTranslation("bestIngredientsDesc", language)}
              </p>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <MdLocalShipping className="text-5xl sm:text-6xl text-coral mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-chocolate mb-3">{getTranslation("fastDelivery", language)}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {getTranslation("fastDeliveryDesc", language)}
              </p>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <MdStarRate className="text-5xl sm:text-6xl text-coral mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-chocolate mb-3">{getTranslation("qualityGuaranteed", language)}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {getTranslation("qualityGuaranteedDesc", language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Info */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-chocolate mb-3 sm:mb-4">{getTranslation("quality", language)}</h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            {getTranslation("qualityDesc", language)}
          </p>
          <button
            onClick={() => onNavigate("order")}
            className="bg-coral text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-red-600 transition transform hover:scale-105"
          >
            {language === 'mr' ? 'संग्रह एक्सप्लोर करा' : 'EXPLORE COLLECTION'}
          </button>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-chocolate text-white py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Ready to Order?</p>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-4 sm:mb-6">Browse our delicious collection and place your order now</p>
          <button
            onClick={() => onNavigate("order")}
            className="bg-coral text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-red-600 transition transform hover:scale-105"
          >
            SHOP NOW
          </button>
          <p className="text-xs sm:text-sm opacity-70 mt-6 sm:mt-8">✓ Delivery only within Phulambri | ✓ Cash on Delivery | ✓ Freshly Baked</p>
        </div>
      </footer>
    </div>
  );
}