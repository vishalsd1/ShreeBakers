import { useState } from "react";
import { FaPhone, FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
        alert("Message sent successfully!");
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Failed to send message. Please try again.");
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-chocolate mb-2 sm:mb-4">
            CONTACT US
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Have questions? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12">
          {/* Call Us */}
          <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-coral/10 rounded-full mb-4">
              <FaPhone className="text-2xl text-coral" />
            </div>
            <h2 className="text-xl font-bold text-chocolate mb-2">Call Us</h2>
            <p className="text-gray-600 mb-4">Reach us directly for orders</p>
            <a href="tel:917498585802" className="text-xl font-bold text-coral hover:underline">
              +91 74985 85802
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <FaWhatsapp className="text-2xl text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-chocolate mb-2">WhatsApp</h2>
            <p className="text-gray-600 mb-4">Chat with us anytime</p>
            <a href="https://wa.me/917498585802" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-green-600 hover:underline">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-chocolate mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-chocolate text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                {submitted ? "Sending..." : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="bg-gray-100 rounded-lg overflow-hidden h-full min-h-[300px] shadow-sm border border-gray-200">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.8815076563947!2d75.42220976405147!3d20.091090112609745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdbbff6cd816725%3A0xefe4295a05ad0c3c!2sShree%20Baker&#39;s!5e1!3m2!1sen!2sin!4v1769088810270!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{border:0, minHeight: "400px"}} 
               allowFullScreen="" 
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               title="Shree Bakers Location"
             ></iframe>
          </div>
        </div>

        {/* Business & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-chocolate mb-4">Visit Our Shop</h2>
            <div className="flex items-start gap-3 mb-4">
              <FaMapMarkerAlt className="text-xl text-coral mt-1" />
              <p className="text-gray-700">
                <a href="https://maps.app.goo.gl/R8tKVxxYeiX5yd4L6" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition">
                  Shop Location<br/>
                  Phulambri, Maharashtra 431111<br/>
                  INDIA
                </a>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FaClock className="text-xl text-coral mt-1" />
              <p className="text-gray-700">
                <strong>Mon - Fri:</strong> 8:00 AM - 8:00 PM<br/>
                <strong>Saturday:</strong> 8:00 AM - 9:00 PM<br/>
                <strong>Sunday:</strong> 9:00 AM - 8:00 PM
              </p>
            </div>
          </div>

          <div className="bg-coral text-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            <p className="opacity-90 mb-4">
              We currently offer delivery services exclusively within <strong>Phulambri</strong> town limits.
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-90 text-sm">
              <li>Free delivery for orders above ₹500</li>
              <li>Delivery time: 10:00 AM - 7:00 PM</li>
              <li>Please place orders at least 24 hours in advance for custom cakes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
