import { useState, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";
import CakeCard from "./CakeCard";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function CakeListing({ onAddToCart, onCakeClick }) {
  const { language } = useLanguage();

  // 🔹 Backend cakes state
  const [cakesData, setCakesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // 🔹 Categories (static)
  const categories = ["All", "Birthday", "Anniversary", "Wedding", "Custom", "Snacks"];

  // 🔹 Fetch cakes from backend
  useEffect(() => {
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        setCakesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch cakes:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Filter helpers
  const toggleWeight = (weight) => {
    setSelectedWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedWeights([]);
    setSelectedTypes([]);
  };

  // 🔹 Apply filters
  let filteredCakes = cakesData;

  if (selectedCategory !== "All") {
    filteredCakes = filteredCakes.filter(
      (cake) => cake.category === selectedCategory
    );
  }

  if (selectedWeights.length > 0) {
    filteredCakes = filteredCakes.filter((cake) =>
      cake.weights?.some((w) => selectedWeights.includes(w.size))
    );
  }

  if (selectedTypes.length > 0) {
    filteredCakes = filteredCakes.filter((cake) =>
      selectedTypes.includes(cake.type)
    );
  }

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    selectedWeights.length +
    selectedTypes.length;

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-bold text-gray-600">
        Loading cakes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 text-center">
        <h1 className="text-4xl font-bold text-chocolate">
          {getTranslation("allProducts", language)}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-3 bg-white border-2 border-coral text-coral rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            FILTER
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-coral text-white rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-72`}
          >
            <div className="space-y-4">
              {/* Category */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-bold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedWeights([]);
                        setSelectedTypes([]);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
                        selectedCategory === cat
                          ? "bg-coral text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-bold mb-3">Weight</h3>
                {["0.5kg", "1kg", "2kg"].map((w) => (
                  <label key={w} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedWeights.includes(w)}
                      onChange={() => toggleWeight(w)}
                    />
                    {w}
                  </label>
                ))}
              </div>

              {/* Type */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-bold mb-3">Type</h3>
                {["Egg", "Eggless"].map((type) => (
                  <label key={type} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <X size={16} /> Reset Filters
                </button>
              )}
            </div>
          </aside>

          {/* Cakes Grid */}
          <main className="flex-1">
            {filteredCakes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border">
                <p className="text-lg font-bold text-gray-600">
                  No cakes found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCakes.map((cake) => (
                  <CakeCard
                    key={cake._id}
                    cake={cake}
                    onAddToCart={onAddToCart}
                    onClick={() => onCakeClick(cake)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
