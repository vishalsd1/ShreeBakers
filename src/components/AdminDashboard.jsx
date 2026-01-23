import { useState, useEffect } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const API_BASE = "";

  // New Cake Form
  const [showAddCake, setShowAddCake] = useState(false);
  const [newCake, setNewCake] = useState({
    name: "",
    description: "",
    category: "Birthday",
    price: "",
    type: "Egg",
    image: "",
    bestseller: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, messagesRes, cakesRes] = await Promise.all([
        fetch(`${API_BASE}/api/orders`),
        fetch(`${API_BASE}/api/messages`),
        fetch(`${API_BASE}/api/cakes`),
      ]);

      setOrders((await ordersRes.json()).reverse());
      setMessages((await messagesRes.json()).reverse());
      setCakes((await cakesRes.json()).reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCake = async (e) => {
    e.preventDefault();

    const payload = {
      ...newCake,
      price: Number(newCake.price),
      weights: [
        { size: "0.5kg", price: Number(newCake.price) },
        { size: "1kg", price: Number(newCake.price) * 1.8 },
      ],
    };

    await fetch(`${API_BASE}/api/cakes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowAddCake(false);
    setNewCake({
      name: "",
      description: "",
      category: "Birthday",
      price: "",
      type: "Egg",
      image: "",
      bestseller: false,
    });

    fetchData();
  };

  const handleDeleteCake = async (id) => {
    if (!window.confirm("Delete this cake?")) return;

    await fetch(`${API_BASE}/api/cakes/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-chocolate text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-white text-chocolate px-4 py-2 rounded font-bold"
        >
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["orders", "messages", "cakes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-bold ${
                activeTab === tab
                  ? "bg-coral text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left">Order</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Delivery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="p-4 font-mono text-sm">
                          #{order._id.slice(-6)}
                          {order.expressDelivery && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                              EXPRESS
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-sm">
                          <p className="font-bold">
                            {order.customerInfo.name}
                          </p>
                          <p>{order.customerInfo.phone}</p>
                        </td>

                        <td className="p-4 text-sm">
                          {order.cartItems.map((i, idx) => (
                            <div key={idx}>
                              {i.quantity}× {i.name} ({i.weight})
                            </div>
                          ))}
                        </td>

                        <td className="p-4 font-bold text-coral">
                          ₹{order.total}
                        </td>

                        <td className="p-4 text-sm">
                          {order.expressDelivery
                            ? `ETA: ${new Date(
                                order.estimatedDeliveryTime
                              ).toLocaleTimeString()}`
                            : "Standard"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <div className="p-6 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className="border rounded p-4 bg-gray-50"
                  >
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm">{m.email}</p>
                    <p className="mt-2">{m.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CAKES */}
            {activeTab === "cakes" && (
              <div className="p-6">
                <button
                  onClick={() => setShowAddCake(true)}
                  className="bg-coral text-white px-4 py-2 rounded font-bold mb-4"
                >
                  <Plus size={16} /> Add Cake
                </button>

                {showAddCake && (
                  <form
                    onSubmit={handleAddCake}
                    className="bg-gray-100 p-4 rounded mb-6 space-y-3"
                  >
                    <input
                      placeholder="Cake Name"
                      required
                      onChange={(e) =>
                        setNewCake({ ...newCake, name: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      placeholder="Price"
                      type="number"
                      required
                      onChange={(e) =>
                        setNewCake({ ...newCake, price: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                    <button className="bg-chocolate text-white px-4 py-2 rounded">
                      Save Cake
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cakes.map((cake) => (
                    <div
                      key={cake._id}
                      className="border rounded shadow-sm"
                    >
                      <div className="p-4">
                        <h3 className="font-bold">{cake.name}</h3>
                        <p className="text-coral font-bold">
                          ₹{cake.price}
                        </p>
                        <button
                          onClick={() => handleDeleteCake(cake._id)}
                          className="mt-2 text-red-600 font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
