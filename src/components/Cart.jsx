import { useState } from "react";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function Cart({ cart, onUpdateCart, onNavigate }) {
  const { language } = useLanguage();
  const [itemToRemove, setItemToRemove] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleRemoveItem = (id, weight) => {
    const item = cart.find(
      (item) => item.id === id && item.weight === weight
    );
    setItemToRemove({ id, weight, name: item?.name });
  };

  const confirmRemove = () => {
    if (!itemToRemove) return;

    const updatedCart = cart.filter(
      (item) =>
        !(item.id === itemToRemove.id && item.weight === itemToRemove.weight)
    );
    onUpdateCart(updatedCart);
    setItemToRemove(null);
  };

  const handleQuantityChange = (id, weight, qty) => {
    if (qty < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id && item.weight === weight
        ? {
            ...item,
            quantity: qty,
            itemTotal: item.price * qty,
          }
        : item
    );

    onUpdateCart(updatedCart);
  };

  const generateWhatsAppMessage = () => {
    const items = cart
      .map(
        (i) =>
          `• ${i.name} (${i.weight}) x${i.quantity} = ₹${i.itemTotal}`
      )
      .join("\n");

    return encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${items}\n\nTotal: ₹${total}`
    );
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      {/* Remove Confirmation */}
      {itemToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">
              Remove Item?
            </h3>
            <p className="text-gray-600 mb-6">
              Remove <strong>{itemToRemove.name}</strong> from cart?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 border px-4 py-2 rounded font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-chocolate mb-6">
          {getTranslation("shoppingCart", language)}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center bg-gray-50 p-10 rounded">
            <p className="text-xl text-gray-600 mb-4">
              {getTranslation("emptyCart", language)}
            </p>
            <button
              onClick={() => onNavigate("order")}
              className="bg-coral text-white px-6 py-3 rounded-lg font-bold"
            >
              {getTranslation("continueShopping", language)}
            </button>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="border rounded mb-6">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 border-b last:border-b-0"
                >
                  <div>
                    <h3 className="font-bold text-chocolate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.weight} • {item.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.weight,
                            item.quantity - 1
                          )
                        }
                        className="font-bold"
                      >
                        −
                      </button>
                      <span className="font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.weight,
                            item.quantity + 1
                          )
                        }
                        className="font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                      <p className="font-bold text-coral">
                        ₹{item.itemTotal}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveItem(item.id, item.weight)
                      }
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="bg-gray-50 p-6 rounded mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-coral">₹{total}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ✓ Cash on Delivery • ✓ Local Delivery • ✓ Freshly Baked
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate("order")}
                className="flex-1 border-2 border-coral text-coral px-6 py-3 rounded-lg font-bold"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => onNavigate("checkout")}
                className="flex-1 bg-coral text-white px-6 py-3 rounded-lg font-bold"
              >
                Proceed to Checkout
              </button>
            </div>

            {/* OPTIONAL WHATSAPP */}
            <div className="text-center mt-6">
              <a
                href={`https://wa.me/917498585802?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 font-bold"
              >
                <FaWhatsapp /> Order via WhatsApp (Optional)
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
