import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reviews`);
      const data = await response.json();
      setReviews(data.reverse());
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews([savedReview.review, ...reviews]);
        setNewReview({ name: "", rating: 5, comment: "" });
        alert("Thank you for your review!");
      }
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-chocolate text-center mb-8">Customer Reviews</h2>

        {/* Review Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h3 className="text-xl font-bold text-chocolate mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-coral text-white px-6 py-2 rounded-lg font-bold hover:bg-coral/90 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <span className="font-bold text-gray-800">{review.name}</span>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
