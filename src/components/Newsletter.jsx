import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Here you would typically send the email to your backend service
    }
  };

  return (
    <section className="bg-coral py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          {language === 'mr' ? 'आमच्या वृत्तपत्राची सदस्यता घ्या' : 'Subscribe to Our Newsletter'}
        </h2>
        <p className="text-lg mb-8 opacity-90">
          {language === 'mr' 
            ? 'नवीन केक, ऑफर आणि अपडेट्स मिळवण्यासाठी साइन अप करा.' 
            : 'Sign up to get updates on new cakes, special offers, and more.'}
        </p>

        {subscribed ? (
          <div className="bg-white text-coral py-4 px-6 rounded-lg inline-block font-bold animate-fade-in">
            {language === 'mr' ? 'धन्यवाद! आपण सदस्यता घेतली आहे.' : 'Thank you for subscribing!'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'mr' ? 'तुमचा ईमेल' : 'Your Email Address'}
              className="px-6 py-3 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-chocolate text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition whitespace-nowrap"
            >
              {language === 'mr' ? 'साइन अप' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
