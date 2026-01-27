import { useState, useEffect } from "react";
import { Plus, Trash2, X, ShoppingBag, MessageSquare, Cake, LogOut, Package, Phone, MapPin, Clock, CheckCircle, Upload, Star, Check } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [reviews, setReviews] = useState([]);
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
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, messagesRes, cakesRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE}/api/orders`),
        fetch(`${API_BASE}/api/messages`),
        fetch(`${API_BASE}/api/cakes`),
        fetch(`${API_BASE}/api/orders?action=reviews&all=true`),
      ]);

      const [ordersData, messagesData, cakesData, reviewsData] = await Promise.all([
        ordersRes.json(),
        messagesRes.json(),
        cakesRes.json(),
        reviewsRes.json().catch(() => []),
      ]);
      
      setOrders(ordersData.reverse());
      setMessages(messagesData.reverse());
      setCakes(cakesData.reverse());
      setReviews(reviewsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result;
      setNewCake({ ...newCake, image: base64String });
      setImagePreview(base64String);
      setUploadingImage(false);
    };
    
    reader.onerror = () => {
      alert("Error reading file");
      setUploadingImage(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleAddCake = async (e) => {
    e.preventDefault();

    if (!newCake.image) {
      alert("Please upload an image");
      return;
    }

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
    setImagePreview("");

    fetchData();
  };

  const handleDeleteCake = async (id) => {
    if (!window.confirm("Delete this cake?")) return;

    await fetch(`${API_BASE}/api/cakes/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders?action=update-status`, {
          method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (response.ok) {
        fetchData(); // Refresh orders
        alert(`Order status updated to: ${newStatus}`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status");
    }
  };

  const handleApproveReview = async (reviewId, approved) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders?action=approve-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId, approved }),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to update review");
      }
    } catch (error) {
      console.error("Review approval error:", error);
      alert("Error updating review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders?action=delete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId }),
      });
      if (res.ok || res.status === 204) {
        fetchData();
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Review delete error:", error);
      alert("Error deleting review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-chocolate to-amber-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cake className="w-8 h-8" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-white/80">Shree Bakers Management</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-coral hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-chocolate mt-1">{orders.length}</p>
              </div>
              <div className="bg-coral/10 p-3 rounded-full">
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-coral" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Messages</p>
                <p className="text-2xl sm:text-3xl font-bold text-chocolate mt-1">{messages.length}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-amber-500 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Cakes</p>
                <p className="text-2xl sm:text-3xl font-bold text-chocolate mt-1">{cakes.length}</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Cake className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0">
            {[
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "cakes", label: "Cakes", icon: Cake },
              { id: "reviews", label: "Reviews", icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-coral to-red-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="p-4 sm:p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Items</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-mono text-sm font-semibold text-gray-900">
                                    #{order._id.slice(-6)}
                                  </span>
                                  {order.expressDelivery && (
                                    <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 w-fit">
                                      🚀 EXPRESS
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">{order.customerInfo.name}</span>
                                  <span className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    {order.customerInfo.phone}
                                  </span>
                                  <span className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {order.customerInfo.address?.slice(0, 30)}...
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm space-y-1">
                                  {order.cartItems.map((item, idx) => (
                                    <div key={idx} className="text-gray-700">
                                      <span className="font-semibold">{item.quantity}×</span> {item.name} 
                                      <span className="text-gray-500"> ({item.weight})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-lg font-bold text-coral">₹{order.total}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 cursor-pointer ${
                                      order.status === "Delivered" ? "bg-green-100 border-green-300 text-green-800" :
                                      order.status === "Out for Delivery" ? "bg-blue-100 border-blue-300 text-blue-800" :
                                      order.status === "Preparing" ? "bg-yellow-100 border-yellow-300 text-yellow-800" :
                                      "bg-gray-100 border-gray-300 text-gray-800"
                                    }`}
                                  >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                                                <td className="px-4 py-4">
                                                                  <div className="flex flex-col gap-2">
                                                                    {order.couponCode && (
                                                                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-semibold">
                                                                        🎫 {order.couponCode}
                                                                      </span>
                                                                    )}
                                                                    {order.discount > 0 && (
                                                                      <span className="text-xs text-green-600 font-semibold">
                                                                        -₹{order.discount} saved
                                                                      </span>
                                                                    )}
                                                                  </div>
                                                                </td>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-mono text-sm font-bold text-chocolate">
                                #{order._id.slice(-6)}
                              </span>
                              {order.expressDelivery && (
                                <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
                                  🚀 EXPRESS
                                </span>
                              )}
                            </div>
                            <span className="text-xl font-bold text-coral">₹{order.total}</span>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-start gap-2">
                              <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-gray-900">{order.customerInfo.name}</p>
                                <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-600">{order.customerInfo.address}</p>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-3 mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                            {order.cartItems.map((item, idx) => (
                              <div key={idx} className="text-sm text-gray-700 mb-1">
                                <span className="font-semibold">{item.quantity}×</span> {item.name} 
                                <span className="text-gray-500"> ({item.weight})</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {order.status}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <div className="p-4 sm:p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No messages yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-lg">
                              {msg.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg">{msg.name}</h3>
                              <p className="text-sm text-gray-600">{msg.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-white/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CAKES */}
            {activeTab === "cakes" && (
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-chocolate">Manage Cakes</h2>
                  <button
                    onClick={() => setShowAddCake(!showAddCake)}
                    className="flex items-center gap-2 bg-gradient-to-r from-coral to-red-500 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition transform hover:scale-105"
                  >
                    {showAddCake ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    <span className="hidden sm:inline">{showAddCake ? "Cancel" : "Add Cake"}</span>
                  </button>
                </div>

                {showAddCake && (
                  <form
                    onSubmit={handleAddCake}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 mb-6 border-2 border-amber-200 shadow-lg"
                  >
                    <h3 className="text-lg font-bold text-chocolate mb-4 flex items-center gap-2">
                      <Cake className="w-5 h-5" />
                      Add New Cake
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cake Name *</label>
                        <input
                          placeholder="e.g., Chocolate Truffle"
                          required
                          value={newCake.name}
                          onChange={(e) =>
                            setNewCake({ ...newCake, name: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-coral focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price (₹) *</label>
                        <input
                          placeholder="e.g., 500"
                          type="number"
                          required
                          value={newCake.price}
                          onChange={(e) =>
                            setNewCake({ ...newCake, price: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-coral focus:outline-none transition"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea
                          placeholder="Describe the cake..."
                          required
                          rows="3"
                          value={newCake.description}
                          onChange={(e) =>
                            setNewCake({ ...newCake, description: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-coral focus:outline-none transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <select
                          value={newCake.category}
                          onChange={(e) =>
                            setNewCake({ ...newCake, category: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-coral focus:outline-none transition bg-white"
                        >
                          {["Birthday", "Anniversary", "Wedding", "Custom", "Snacks"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                        <select
                          value={newCake.type}
                          onChange={(e) =>
                            setNewCake({ ...newCake, type: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-coral focus:outline-none transition bg-white"
                        >
                          <option value="Egg">🥚 Egg</option>
                          <option value="Eggless">🌱 Eggless</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Image * (Max 2MB)
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-coral transition bg-white">
                                <Upload className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-600 font-medium">
                                  {uploadingImage ? "Uploading..." : "Choose Image from Device"}
                                </span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImage}
                              />
                            </label>
                          </div>
                          
                          {imagePreview && (
                            <div className="relative rounded-lg overflow-hidden border-2 border-green-300 bg-green-50 p-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview("");
                                  setNewCake({ ...newCake, image: "" });
                                }}
                                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="mt-2 flex items-center gap-2 text-green-700 text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Image uploaded successfully!
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-coral transition">
                          <input
                            type="checkbox"
                            checked={newCake.bestseller}
                            onChange={(e) =>
                              setNewCake({ ...newCake, bestseller: e.target.checked })
                            }
                            className="w-5 h-5 text-coral focus:ring-coral rounded"
                          />
                          <span className="font-semibold text-gray-700">⭐ Mark as Bestseller</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-chocolate to-amber-800 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition transform hover:scale-105"
                      >
                        Save Cake
                      </button>
                      <button
                        type="button"
                        onClick={() => {
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
                          setImagePreview("");
                        }}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {cakes.length === 0 ? (
                  <div className="text-center py-12">
                    <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No cakes added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {cakes.map((cake) => (
                      <div
                        key={cake._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
                      >
                        <div className="relative h-48 bg-gradient-to-b from-peach to-cream overflow-hidden">
                          <img
                            src={cake.image}
                            alt={cake.name}
                            className="w-full h-full object-cover"
                          />
                          {cake.bestseller && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              ⭐ Bestseller
                            </div>
                          )}
                          <div className="absolute bottom-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              cake.type === "Eggless" 
                                ? "bg-green-500 text-white" 
                                : "bg-yellow-500 text-white"
                            }`}>
                              {cake.type === "Eggless" ? "🌱 Eggless" : "🥚 Egg"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                              {cake.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-chocolate mb-2 line-clamp-1">{cake.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cake.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Base Price</p>
                              <p className="text-2xl font-bold text-coral">₹{cake.price}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteCake(cake._id)}
                              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div className="p-4 sm:p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No reviews submitted yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-100 text-amber-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                              {review.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-chocolate">{review.name}</p>
                              <div className="flex items-center gap-1 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`w-4 h-4 ${idx < review.rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              review.approved
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}
                          >
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed flex-1">{review.comment}</p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveReview(review._id, !review.approved)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border transition ${
                              review.approved
                                ? 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            }`}
                          >
                            {review.approved ? 'Mark Pending' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
