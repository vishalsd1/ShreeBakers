import { useState, useEffect } from "react";
import { FaTimes, FaTrash, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function Cart({ cart, onUpdateCart, onNavigate, onCheckout, user }) {
  const { language } = useLanguage();
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';
  
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    customMessage: ""
  });

  // Auto-fill user info
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      }));
    }
  }, [user]);

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryCharge = 0;
  const finalTotal = cartTotal + deliveryCharge - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/coupons/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const coupon = data.coupon;
        if (cartTotal < coupon.minOrder) {
          setCouponMessage(`Minimum order of ₹${coupon.minOrder} required`);
          setDiscount(0);
        } else {
          let discountAmount = 0;
          if (coupon.type === 'percentage') {
            discountAmount = Math.floor((cartTotal * coupon.value) / 100);
          } else {
            discountAmount = coupon.value;
          }
          setDiscount(discountAmount);
          setCouponMessage(`Coupon applied! You saved ₹${discountAmount}`);
        }
      } else {
        setCouponMessage(data.message);
        setDiscount(0);
      }
    } catch (error) {
      setCouponMessage("Failed to verify coupon");
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validate phone
    if (customerInfo.phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const orderData = {
      customerInfo,
      cartItems: cart,
      total: finalTotal, // Use finalTotal with discount
      discount,
      couponCode: discount > 0 ? couponCode : null,
      status: "Confirmed",
      paymentMethod: "Cash on Delivery"
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        onCheckout(orderData);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert("Failed to place order. Please try again. You can still order via WhatsApp if this persists.");
    }
  };

  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-chocolate mb-8">Checkout</h1>
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold text-chocolate">Customer Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (10 digits) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address (Phulambri only) *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={customerInfo.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                  <select
                    name="deliveryTime"
                    required
                    value={customerInfo.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  >
                    <option value="">Select Time</option>
                    <option value="10 AM - 12 PM">10 AM - 12 PM</option>
                    <option value="12 PM - 2 PM">12 PM - 2 PM</option>
                    <option value="2 PM - 4 PM">2 PM - 4 PM</option>
                    <option value="4 PM - 6 PM">4 PM - 6 PM</option>
                    <option value="6 PM - 8 PM">6 PM - 8 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message on Cake (Optional)</label>
                <input
                  type="text"
                  name="customMessage"
                  maxLength="50"
                  value={customerInfo.customMessage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="Happy Birthday..."
                />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
               <div className="flex justify-between text-lg font-bold text-chocolate">
                 <span>Payable Amount</span>
                 <span>₹{finalTotal}</span>
               </div>
               {discount > 0 && (
                 <p className="text-green-600 text-sm mt-1">Includes discount of ₹{discount}</p>
               )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 bg-coral text-white px-6 py-3 rounded-lg font-bold hover:bg-coral/90 transition"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                
                {/* Coupon Section */}
                <div className="py-4 border-t border-gray-100">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-sm ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold border-t border-gray-100 pt-2">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-bold text-coral border-t-2 border-dashed border-gray-200 pt-4 mt-2">
                  <span>Payable Amount</span>
                  <span>₹{finalTotal}</span>
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
                  onClick={() => setIsCheckingOut(true)}
                  className="flex-1 bg-coral text-white px-6 py-3 rounded-lg font-bold hover:bg-coral/90 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
}
