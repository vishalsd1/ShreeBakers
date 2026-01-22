import { useState } from "react";

export default function CakeCard({ cake, onAddToCart, onClick }) {
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200">
      {/* Image Container */}
      <div 
        className="relative bg-linear-to-b from-peach to-cream h-40 sm:h-48 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img 
          src={cake.image}  
          alt={cake.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Bestseller Badge */}
        {cake.bestseller && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Bestseller
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Type Badge */}
        <div className="mb-2">
          <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${
            cake.type === "Eggless" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {cake.type}
          </span>
        </div>

        {/* Name */}
        <h3 
          className="text-sm sm:text-base md:text-lg font-bold text-chocolate mb-1 line-clamp-2 cursor-pointer hover:text-coral transition-colors"
          onClick={onClick}
        >
          {cake.name}
        </h3>
        
        {/* Description (Short) */}
        {cake.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">{cake.description}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-coral">₹{itemPrice}</span>
          {cake.weights.length > 1 && (
            <span className="text-xs text-gray-500">({selectedWeight})</span>
          )}
        </div>

        {/* Weight Selection (if multiple weights) */}
        {cake.weights.length > 1 && (
          <div className="mb-3 sm:mb-4">
            <div className="flex gap-2 flex-wrap">
              {cake.weights.map((weight) => (
                <button
                  key={weight.size}
                  onClick={() => setSelectedWeight(weight.size)}
                  className={`text-xs px-2 sm:px-3 py-1 rounded border-2 transition ${
                    selectedWeight === weight.size
                      ? "bg-coral text-white border-coral"
                      : "bg-white text-chocolate border-gray-300 hover:border-coral"
                  }`}
                >
                  {weight.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-coral text-white font-bold py-2 px-3 sm:px-4 rounded hover:bg-red-600 transition text-xs sm:text-sm"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
