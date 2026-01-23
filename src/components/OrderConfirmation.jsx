import { generateWhatsAppMessage, getWhatsAppLink } from "../utils/helpers";
import { FaPhone, FaWhatsapp, FaCheckCircle } from "react-icons/fa";

export default function OrderConfirmation({ order, onNavigate }) {
  const whatsAppMessage = generateWhatsAppMessage(order);
  const whatsAppLink = getWhatsAppLink(whatsAppMessage);

  return (
    <div className="min-h-screen bg-white py-6 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8 sm:mb-12">
          <FaCheckCircle className="text-5xl sm:text-7xl text-green-500 mb-3 sm:mb-4 mx-auto" />
          <h1 className="text-2xl sm:text-4xl font-bold text-chocolate mb-2">
            ORDER PLACED SUCCESSFULLY 🎉
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Thank you! Your order has been saved. Our team will contact you shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-chocolate mb-6">
            ORDER DETAILS
          </h2>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-chocolate mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {order.customerInfo.name}</p>
              <p><strong>Mobile:</strong> {order.customerInfo.phone}</p>
              <p><strong>Address:</strong> {order.customerInfo.address}</p>
              <p><strong>Delivery Date:</strong> {order.customerInfo.deliveryDate}</p>
              <p><strong>Delivery Time:</strong> {order.customerInfo.deliveryTime}</p>
              {order.customerInfo.customMessage && (
                <p><strong>Message on Cake:</strong> “{order.customerInfo.customMessage}”</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-bold text-chocolate mb-3">ITEMS ORDERED</h3>
            <div className="space-y-3 border-b pb-4">
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-chocolate">{item.name}</p>
                    <p className="text-gray-600">
                      {item.weight} • {item.type} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-coral">₹{item.itemTotal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <span className="text-lg font-bold text-chocolate">Total Amount</span>
            <span className="text-2xl font-bold text-coral">₹{order.total}</span>
          </div>

          {/* Status */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700 font-semibold">
              ✓ Order Status: Confirmed
            </p>
            <p className="text-green-600 text-sm mt-1">
              You don’t need to do anything else. We’ll contact you soon.
            </p>
          </div>
        </div>

        {/* Optional WhatsApp */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-lg font-semibold text-chocolate mb-2">
            Want faster confirmation?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            You can optionally send your order details on WhatsApp.
          </p>

          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            <FaWhatsapp />
            Send on WhatsApp (Optional)
          </a>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-chocolate mb-4">Need Help?</h3>
          <div className="space-y-3">
            <a
              href="tel:917498585802"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold justify-center hover:bg-blue-700 transition"
            >
              <FaPhone /> Call Us
            </a>
            <a
              href="https://wa.me/917498585802"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold justify-center hover:bg-green-700 transition"
            >
              <FaWhatsapp /> WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="flex-1 border-2 border-chocolate text-chocolate px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => onNavigate("order")}
            className="flex-1 bg-coral text-white px-6 py-3 rounded-lg font-bold hover:bg-coral/90 transition"
          >
            Order More Cakes
          </button>
        </div>
      </div>
    </div>
  );
}
