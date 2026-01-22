import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  // New Cake Form State
  const [showAddCake, setShowAddCake] = useState(false);
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    category: 'Birthday',
    price: '',
    type: 'Egg',
    image: '',
    bestseller: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, messagesRes, cakesRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/messages'),
        fetch('http://localhost:5000/api/cakes')
      ]);
      
      const ordersData = await ordersRes.json();
      const messagesData = await messagesRes.json();
      const cakesData = await cakesRes.json();
      
      setOrders(ordersData.reverse());
      setMessages(messagesData.reverse());
      setCakes(cakesData.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCake({ ...newCake, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCake = async (e) => {
    e.preventDefault();
    try {
        const cakePayload = {
            ...newCake,
            price: Number(newCake.price),
            weights: [
                { size: "0.5kg", price: Number(newCake.price) },
                { size: "1kg", price: Number(newCake.price) * 1.8 } 
            ]
        };

        const response = await fetch('http://localhost:5000/api/cakes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cakePayload)
        });

        if (response.ok) {
            fetchData();
            setShowAddCake(false);
            setNewCake({
                name: '',
                description: '',
                category: 'Birthday',
                price: '',
                type: 'Egg',
                image: '',
                bestseller: false
            });
        }
    } catch (error) {
        console.error('Error adding cake:', error);
    }
  };

  const handleDeleteCake = async (id) => {
      if (window.confirm('Are you sure you want to delete this cake?')) {
          try {
              await fetch(`http://localhost:5000/api/cakes/${id}`, {
                  method: 'DELETE'
              });
              fetchData();
          } catch (error) {
              console.error('Error deleting cake:', error);
          }
      }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-chocolate text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={onLogout}
          className="bg-white text-chocolate px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'orders' 
                ? 'bg-coral text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'messages' 
                ? 'bg-coral text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('cakes')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              activeTab === 'cakes' 
                ? 'bg-coral text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cakes ({cakes.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Order ID</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Date</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Customer</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Items</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Total</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">#{String(order._id).slice(-6)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{order.customerInfo.name}</p>
                          <p className="text-xs text-gray-500">{order.customerInfo.phone}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{order.customerInfo.address}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.cartItems.map((item, i) => (
                            <div key={i}>
                              {item.quantity}x {item.name} ({item.weight})
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-bold text-coral">₹{order.total}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Date</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Name</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Email</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {messages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{msg.name}</td>
                        <td className="px-6 py-4 text-sm text-blue-600">{msg.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'cakes' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-chocolate">Manage Cakes</h3>
                  <button 
                    onClick={() => setShowAddCake(true)}
                    className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-lg font-bold hover:bg-coral/90 transition"
                  >
                    <Plus size={20} /> Add New Cake
                  </button>
                </div>

                {showAddCake && (
                  <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-gray-800">New Cake Details</h4>
                      <button onClick={() => setShowAddCake(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <form onSubmit={handleAddCake} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Cake Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none"
                            value={newCake.name}
                            onChange={e => setNewCake({...newCake, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                          <textarea 
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none"
                            rows="3"
                            value={newCake.description}
                            onChange={e => setNewCake({...newCake, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (0.5kg)</label>
                            <input 
                              type="number" 
                              required
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none"
                              value={newCake.price}
                              onChange={e => setNewCake({...newCake, price: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select 
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-coral/20 focus:border-coral outline-none"
                              value={newCake.category}
                              onChange={e => setNewCake({...newCake, category: e.target.value})}
                            >
                              <option value="Birthday">Birthday</option>
                              <option value="Anniversary">Anniversary</option>
                              <option value="Wedding">Wedding</option>
                              <option value="Custom">Custom</option>
                              <option value="Snacks">Snacks</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                          <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="type" 
                                value="Egg"
                                checked={newCake.type === 'Egg'}
                                onChange={e => setNewCake({...newCake, type: e.target.value})}
                                className="text-coral focus:ring-coral"
                              />
                              <span>Contains Egg</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="type" 
                                value="Eggless"
                                checked={newCake.type === 'Eggless'}
                                onChange={e => setNewCake({...newCake, type: e.target.value})}
                                className="text-coral focus:ring-coral"
                              />
                              <span>Eggless</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Cake Image</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-coral transition cursor-pointer relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {newCake.image ? (
                              <img src={newCake.image} alt="Preview" className="h-32 mx-auto object-cover rounded" />
                            ) : (
                              <div className="text-gray-400">
                                <Upload className="mx-auto mb-2" />
                                <span className="text-sm">Click to upload image</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="bestseller"
                            checked={newCake.bestseller}
                            onChange={e => setNewCake({...newCake, bestseller: e.target.checked})}
                            className="rounded text-coral focus:ring-coral"
                          />
                          <label htmlFor="bestseller" className="text-sm font-bold text-gray-700">Mark as Bestseller</label>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-chocolate text-white py-3 rounded-lg font-bold hover:bg-chocolate/90 transition shadow-lg"
                        >
                          Add Cake
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cakes.map((cake) => (
                    <div key={cake._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="relative h-48">
                        <img src={(typeof cake.image === 'string' && (cake.image.startsWith('data:image') || cake.image.startsWith('http'))) ? cake.image : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt={cake.name} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleDeleteCake(cake._id)}
                          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                        {cake.bestseller && (
                          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800 line-clamp-1">{cake.name}</h4>
                          <span className="text-coral font-bold">₹{cake.price}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{cake.description}</p>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <span className={`px-2 py-1 rounded ${cake.type === 'Eggless' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {cake.type}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {cake.category}
                          </span>
                        </div>
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
