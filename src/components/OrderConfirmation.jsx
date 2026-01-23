import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderConfirmation({ order, onNavigate }) {
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    if (!order.estimatedDeliveryTime) return;

    const interval = setInterval(() => {
      const diff =
        new Date(order.estimatedDeliveryTime) - new Date();

      setMinutesLeft(Math.max(0, Math.floor(diff / 60000)));
    }, 60000);

    return () => clearInterval(interval);
  }, [order]);

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-xl mx-auto text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed 🎉</h1>

        {order.expressDelivery && (
          <p className="text-lg font-bold text-coral mb-4">
            🚴 Estimated delivery in {minutesLeft} minutes
          </p>
        )}

        <p className="text-gray-600 mb-6">
          Our team will contact you shortly.
        </p>

        <button
          onClick={() => onNavigate("home")}
          className="bg-coral text-white px-6 py-3 rounded-lg font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
