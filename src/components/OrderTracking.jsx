import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function OrderTracking() {
  const { language } = useLanguage();
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-chocolate mb-8 text-center">Track Your Order</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <input
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-coral text-white px-8 py-3 rounded-lg font-bold hover:bg-coral/90 transition disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Track Order'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>

        {orders && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center text-gray-600 bg-white p-8 rounded-lg">
                No orders found for this number.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Order #{order.id.slice(-6)}</span>
                      <p className="font-bold text-chocolate mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    {order.cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-2">
                        <span>{item.quantity}x {item.name} ({item.weight})</span>
                        <span className="font-semibold">₹{item.itemTotal}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="font-bold text-gray-600">Total</span>
                    <span className="text-xl font-bold text-coral">₹{order.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
