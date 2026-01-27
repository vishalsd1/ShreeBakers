import { useState } from "react";

export default function Login({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ phone: "", name: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    if (isRegistering && (!formData.name || !formData.address)) {
      setError("Name and address are required for signup");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegistering ? '/api/orders?action=register-user' : '/api/orders?action=login-user';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Authentication failed');
        return;
      }

      onLogin(data.user);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-chocolate text-center mb-8">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  rows="3"
                  required
                ></textarea>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white py-3 rounded-lg font-bold hover:bg-coral/90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-chocolate hover:underline text-sm font-semibold"
          >
            {isRegistering ? 'Already have an account? Login' : 'New to Shree Bakers? Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
