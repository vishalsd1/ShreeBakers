import { useState } from "react";

export default function Checkout({ cart, onCheckout }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    customMessage: "",
  });

  const [expressDelivery, setExpressDelivery] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    const payload = {
      customerInfo: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        deliveryDate: form.deliveryDate,
        deliveryTime: form.deliveryTime,
        customMessage: form.customMessage,
      },
      cartItems: cart,
      total,
      discount: 0,
      couponCode: null,
      paymentMethod: "Cash on Delivery",
      expressDelivery,
    };

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

          <div className="flex gap-4">
            <input
              type="date"
              name="deliveryDate"
              required
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="time"
              name="deliveryTime"
              required
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <input
            name="customMessage"
            placeholder="Message on cake (optional)"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          {/* 🚀 EXPRESS DELIVERY */}
          <label className="flex items-center gap-2 font-bold text-coral">
            <input
              type="checkbox"
              checked={expressDelivery}
              onChange={(e) => setExpressDelivery(e.target.checked)}
            />
            🚀 25-Minute Express Delivery
          </label>

          <div className="bg-gray-50 p-4 rounded font-bold">
            Total: ₹{total}
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
