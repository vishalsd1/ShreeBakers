import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function Footer({ onNavigate }) {
  const { language } = useLanguage();

  return (
    <footer className="bg-chocolate text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SHREE BAKERS</h2>
          <p className="opacity-80 mb-4">
            {language === 'mr' 
              ? "फुलाम्बरी मधील सर्वोत्तम केक शॉप. आम्ही तुमच्या विशेष क्षणांसाठी ताजे आणि स्वादिष्ट केक बनवतो."
              : "The best cake shop in Phulambri. We bake fresh and delicious cakes for your special moments."}
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/shreebakerscakeshop/" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition">
              <FaInstagram size={24} />
            </a>
            <a href="https://wa.me/917498585802" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">{language === 'mr' ? 'त्वरित दुवे' : 'Quick Links'}</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate("home")} className="hover:text-coral transition">
                {language === 'mr' ? 'होम' : 'Home'}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("order")} className="hover:text-coral transition">
                {language === 'mr' ? 'केक' : 'Cakes'}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("contact")} className="hover:text-coral transition">
                {language === 'mr' ? 'संपर्क' : 'Contact'}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">{language === 'mr' ? 'संपर्क माहिती' : 'Contact Info'}</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-coral" />
              <a href="https://maps.app.goo.gl/R8tKVxxYeiX5yd4L6" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition">
                Phulambri, Maharashtra, INDIA
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-coral" />
              <a href="tel:917498585802" className="hover:text-coral transition">+91 74985 85802</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 pt-6 text-center text-sm opacity-70 flex flex-col gap-2">
        <p>&copy; {new Date().getFullYear()} Shree Bakers. All rights reserved.</p>
        <button onClick={() => onNavigate('admin-login')} className="text-xs hover:text-white text-chocolate/50 transition">Admin Login</button>
      </div>
    </footer>
  );
}
