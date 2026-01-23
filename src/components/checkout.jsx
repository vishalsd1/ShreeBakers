import { useState } from "react";

export default function Checkout({ cart, onCheckout }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    customMessage: "",
    expressDelivery: false,
  });

  const total = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerInfo: form,
      cartItems: cart,
      total,
      expressDelivery: form.expressDelivery,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      onCheckout(data);
    } else {
      alert("Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-chocolate mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <input name="phone" placeholder="Mobile Number" required maxLength="10" onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <textarea name="address" placeholder="Delivery Address" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />

          <div className="flex gap-4">
            <input type="date" name="deliveryDate" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
            <input type="time" name="deliveryTime" required onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          </div>

          <input name="customMessage" placeholder="Message on cake (optional)" onChange={handleChange} className="w-full border px-4 py-2 rounded" />

          {/* 🚀 EXPRESS DELIVERY */}
          <label className="flex items-center gap-2 font-bold text-coral">
            <input
              type="checkbox"
              name="expressDelivery"
              checked={form.expressDelivery}
              onChange={handleChange}
            />
            🚀 25-Minute Express Delivery
          </label>

          <div className="bg-gray-50 p-4 rounded font-bold">
            Total: ₹{total}
          </div>

          <button type="submit" className="w-full bg-coral text-white py-3 rounded-lg font-bold">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
