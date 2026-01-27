import { MdCake, MdLocalShipping, MdStarRate, MdStar } from "react-icons/md";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function Home({ onNavigate }) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    fetch("/api/orders?action=reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/orders?action=reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        alert("Thank you! Your review will be visible after approval.");
        setReviewForm({ name: "", rating: 5, comment: "" });
        setShowReviewForm(false);
      }
    } catch (error) {
      alert("Failed to submit review");
    }
  };

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

      {/* Customer Reviews */}
      <section className="py-12 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chocolate text-center mb-8 sm:mb-12">
            {language === 'mr' ? 'ग्राहक पुनरावलोकने' : 'Customer Reviews'}
          </h2>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <MdStar
                        key={i}
                        className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-chocolate font-semibold text-sm">— {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mb-8">No reviews yet. Be the first to review!</p>
          )}

          {!showReviewForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="max-w-lg mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-chocolate mb-4">Share Your Experience</h3>
              
              <input
                type="text"
                placeholder="Your Name"
                required
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                className="w-full border px-4 py-2 rounded mb-4"
              />

              <div className="mb-4">
                <label className="block text-sm font-semibold text-chocolate mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-3xl focus:outline-none"
                    >
                      <MdStar className={star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Tell us about your experience..."
                required
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full border px-4 py-2 rounded mb-4 h-24"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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