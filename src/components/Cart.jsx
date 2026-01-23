import { useState } from "react";
import { FaTimes, FaTrash, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function Cart({ cart, onUpdateCart, onNavigate, onCheckout }) {
  const { language } = useLanguage();
  const [itemToRemove, setItemToRemove] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleRemoveItem = (id, weight) => {
    const item = cart.find(item => item.id === id && item.weight === weight);
    setItemToRemove({ id, weight, name: item?.name });
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      const filteredCart = cart.filter(
        (item) => !(item.id === itemToRemove.id && item.weight === itemToRemove.weight)
      );
      onUpdateCart(filteredCart);
      setItemToRemove(null);
    }
  };

  const handleQuantityChange = (id, weight, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.weight === weight) {
        return {
          ...item,
          quantity: newQuantity,
          itemTotal: item.price * newQuantity
        };
      }
      return item;
    });
    onUpdateCart(updatedCart);
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cart.map(item => `• ${item.name} (${item.weight}) x${item.quantity} = ₹${item.itemTotal}`).join('\n');
    const message = `Hi! I'd like to place an order:\n\n${itemsList}\n\nTotal: ₹${total}\n\nPlease confirm the order.`;
    return encodeURIComponent(message);
  };

  const handleOrderViaWhatsApp = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/917498585802?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      {/* Confirmation Modal */}
      {itemToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-lg font-bold text-chocolate mb-3">{language === 'mr' ? 'आइटम काढून टाकायचा?' : 'Remove Item?'}</h3>
              <p className="text-gray-600 mb-6">
                {language === 'mr' 
                  ? `क्या आप सुनिश्चित है कि आप <strong>${itemToRemove.name}</strong> (${itemToRemove.weight}) आपली कार्ट मधून काढून टाकू?`
                  : `Are you sure you want to remove <strong>${itemToRemove.name}</strong> (${itemToRemove.weight}) from your cart?`
                }
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setItemToRemove(null)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-bold text-chocolate hover:bg-gray-50 transition"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                >
                  {getTranslation("remove", language)}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-chocolate mb-6 sm:mb-8">{getTranslation("shoppingCart", language)}</h1>

          {cart.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-12 text-center">
              <p className="text-lg sm:text-2xl text-gray-600 font-semibold mb-4 sm:mb-6">{getTranslation("emptyCart", language)}</p>
              <button
                onClick={() => onNavigate("order")}
                className="bg-coral text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-coral/90 transition"
              >
                {getTranslation("continueShopping", language)}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="bg-white border border-gray-200 rounded-lg mb-4 sm:mb-6 overflow-hidden">
                {cart.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-b-0 p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-chocolate break-words">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.weight} • {item.type}</p>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.weight, item.quantity - 1)
                            }
                            className="text-chocolate font-bold text-sm sm:text-base hover:text-coral transition"
                          >
                            −
                          </button>
                          <span className="font-bold text-chocolate w-6 sm:w-8 text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.weight, item.quantity + 1)
                            }
                            className="text-chocolate font-bold text-sm sm:text-base hover:text-coral transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                          <p className="text-lg font-bold text-coral">₹{item.itemTotal}</p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id, item.weight)}
                          className="text-gray-400 hover:text-red-500 transition font-bold"
                          title="Remove"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-chocolate">Total Amount:</span>
                  <span className="text-3xl font-bold text-coral">₹{total}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <p className="text-sm text-gray-600">✓ Order via WhatsApp</p>
                  <p className="text-sm text-gray-600">✓ Delivery within Phulambri only</p>
                  <p className="text-sm text-gray-600">✓ Cash on Delivery</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("order")}
                  className="flex-1 bg-white text-coral border-2 border-coral px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleOrderViaWhatsApp}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl" />
                  Order via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
}
