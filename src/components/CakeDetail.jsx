import { useState } from "react";
import { ArrowLeft, Star, ShoppingCart, Truck, Clock, ShieldCheck } from "lucide-react";

export default function CakeDetail({ cake, onAddToCart, onBack }) {
  const [selectedWeight, setSelectedWeight] = useState(cake.weights[0].size);
  const selectedWeightObj = cake.weights.find((w) => w.size === selectedWeight);
  const itemPrice = selectedWeightObj.price;

  const handleAddToCart = () => {
    onAddToCart({
      id: cake._id,
      name: cake.name,
      price: itemPrice,
      weight: selectedWeight,
      quantity: 1,
      type: cake.type,
      itemTotal: itemPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-chocolate hover:text-coral transition mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back to Menu
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 md:h-full min-h-[400px]">
              <img 
                src={cake.image} 
                alt={cake.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {cake.bestseller && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Bestseller
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${
                  cake.type === "Eggless" 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}>
                  {cake.type === "Eggless" ? "🥬 Eggless" : "🥚 Contains Egg"}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-bold text-chocolate mb-4 leading-tight">
                  {cake.name}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {cake.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 border-y border-gray-100 py-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-coral" />
                    <span>Freshly Baked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck size={16} className="text-coral" />
                    <span>Instant Delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={16} className="text-coral" />
                    <span>Quality Check</span>
                  </div>
                </div>
              </div>

              {/* Selection & Action */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Select Weight</label>
                  <div className="flex flex-wrap gap-3">
                    {cake.weights.map((weight) => (
                      <button
                        key={weight.size}
                        onClick={() => setSelectedWeight(weight.size)}
                        className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                          selectedWeight === weight.size
                            ? "border-coral bg-coral/5 text-coral shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-coral/50"
                        }`}
                      >
                        {weight.size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Price</p>
                    <p className="text-4xl font-bold text-coral">₹{itemPrice}</p>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="bg-coral text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-coral/90 transition shadow-lg hover:shadow-coral/30 flex items-center gap-2"
                  >
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
