import { useState } from "react";
import { Tag, Percent } from "lucide-react";

export default function Checkout({ cart, onCheckout }) {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    customMessage: "",
  });

  const [expressDelivery, setExpressDelivery] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null, loading: false, error: "" });

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discount = couponApplied ? couponApplied.discountAmount : 0;
  const total = couponApplied ? couponApplied.newTotal : subtotal;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggleExpress = (checked) => {
    setExpressDelivery(checked);
    if (checked) {
      // Clear scheduled fields when switching to express so they're not sent/required
      setForm((prev) => ({ ...prev, deliveryDate: "", deliveryTime: "" }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const response = await fetch("/api/orders?action=validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, total: subtotal }),
      });

      const data = await response.json();

      if (response.ok) {
        setCouponApplied(data);
        alert(`Coupon applied! You saved ₹${data.discountAmount}`);
      } else {
        alert(data.message || "Invalid coupon");
        setCouponApplied(null);
      }
    } catch (error) {
      alert("Failed to validate coupon");
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!location.lat || !location.lng) {
      alert("Please enable location and tap 'Use My Location' so we can verify delivery area.");
      return;
    }

    setLoading(true);

    // Ensure cartItems is an array (not stringified)
    const cartItems = Array.isArray(cart) ? cart : JSON.parse(cart);

    const payload = {
      customerInfo: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        deliveryDate: form.deliveryDate,
        deliveryTime: form.deliveryTime,
        customMessage: form.customMessage,
      },
      cartItems: cartItems,
      total,
      discount: discount,
      couponCode: couponApplied ? couponCode.toUpperCase() : null,
      paymentMethod: "Cash on Delivery",
      expressDelivery,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    };

    console.log("Payload being sent:", payload);
    console.log("Cart type:", typeof cart, "Is array:", Array.isArray(cart));
    console.log("CartItems:", cartItems);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Order error:", data);
        alert(data.message || "Failed to place order");
        setLoading(false);
        return;
      }

      // ✅ VERY IMPORTANT FIX
      setLoading(false);

      // backend returns { message, order }
      onCheckout(data.order);
    } catch (error) {
      console.error("Network error:", error);
      alert("Server error. Please try again.");
      setLoading(false);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "Geolocation not supported on this device." }));
      return;
    }
    setLocation((prev) => ({ ...prev, loading: true, error: "" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: "",
        });
      },
      (err) => {
        setLocation({ lat: null, lng: null, loading: false, error: err.message || "Unable to fetch location" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-chocolate mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="phone"
            placeholder="Mobile Number"
            required
            maxLength="10"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            required
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          {!expressDelivery && (
            <div className="flex gap-4">
              <input
                type="date"
                name="deliveryDate"
                required
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="time"
                name="deliveryTime"
                required
                value={form.deliveryTime}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          )}

          <input
            name="customMessage"
            placeholder="Message on cake (optional)"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          {/* GPS Location */}
          <div className="border-2 border-blue-100 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-chocolate">Delivery Location</h3>
                <p className="text-sm text-gray-600">We need your GPS to confirm you are within our delivery area.</p>
              </div>
              <button
                type="button"
                onClick={fetchLocation}
                disabled={location.loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {location.loading ? "Locating..." : "Use My Location"}
              </button>
            </div>
            {location.error && (
              <p className="text-red-600 text-sm mt-2">{location.error}</p>
            )}
            {location.lat && location.lng && (
              <p className="text-green-700 text-sm mt-2 font-semibold">
                Location locked: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-coral" />
              <h3 className="font-bold text-chocolate">Have a Coupon?</h3>
            </div>
            
            {!couponApplied ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border-2 border-gray-300 px-4 py-2 rounded-lg uppercase font-mono focus:border-coral focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="bg-coral text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            ) : (
              <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-green-700" />
                    <div>
                      <p className="font-bold text-green-800">{couponCode}</p>
                      <p className="text-sm text-green-700">
                        {couponApplied.discount}% off - Saved ₹{couponApplied.discountAmount}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-600 font-bold text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 🚀 EXPRESS DELIVERY */}
          <label className="flex items-center gap-2 font-bold text-coral">
            <input
              type="checkbox"
              checked={expressDelivery}
              onChange={(e) => handleToggleExpress(e.target.checked)}
            />
            🚀 25-Minute Express Delivery
          </label>
          {expressDelivery && (
            <p className="text-sm text-gray-600 -mt-2">
              We will deliver in ~25 minutes. Scheduling is disabled for express orders.
            </p>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({couponApplied.discount}%):</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="border-t-2 border-gray-300 pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-coral">₹{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white ${
              loading ? "bg-gray-400" : "bg-coral hover:bg-red-600"
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
