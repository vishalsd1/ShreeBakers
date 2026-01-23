import { useState } from "react";
import { ShoppingCart, Filter, X, Check } from "lucide-react";
import CakeCard from "./CakeCard";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

export default function CakeListing({ onAddToCart }) {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleWeight = (weight) => {
    setSelectedWeights(prev =>
      prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  let filteredCakes = cakesData;

  if (selectedCategory !== "All") {
    filteredCakes = filteredCakes.filter(cake => cake.category === selectedCategory);
  }

  if (selectedWeights.length > 0) {
    filteredCakes = filteredCakes.filter(cake =>
      cake.weights.some(w => selectedWeights.includes(w.size))
    );
  }

  if (selectedTypes.length > 0) {
    filteredCakes = filteredCakes.filter(cake => selectedTypes.includes(cake.type));
  }

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedWeights([]);
    setSelectedTypes([]);
  };

  const activeFiltersCount = 
    (selectedCategory !== "All" ? 1 : 0) + 
    selectedWeights.length + 
    selectedTypes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-chocolate mb-2 sm:mb-4 tracking-tight">
              {getTranslation("allProducts", language)}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed px-2">
              {language === 'mr'
                ? "कोणताही उदयापन केकशिवाय पूर्ण नाही. आमच्या स्वादिष्ट हस्तनिर्मित केकांचे संग्रह एक्सप्लोर करा जे दैनिक ताजे घटकांसह बनवले जाते."
                : "No celebration is complete without cake. Explore our delicious collection of handcrafted cakes made fresh daily with premium ingredients."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-coral text-coral rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-coral hover:text-white transition-all shadow-sm text-sm sm:text-base"
          >
            <Filter size={18} />
            {showFilters ? getTranslation("filter", language).toUpperCase() : getTranslation("filter", language).toUpperCase()}
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-coral text-white rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0`}>
            <div className="sticky top-4 space-y-3 sm:space-y-4">
              {/* Category Filter */}
              <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 sm:p-5 border-b border-gray-100">
                  <h3 className="font-bold text-chocolate text-xs sm:text-sm uppercase tracking-wide">
                    {language === 'mr' ? 'श्रेणी' : 'Categories'}
                  </h3>
                </div>
                <div className="p-2 sm:p-3">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
                    {categories.map((category) => {
                      const categoryLabel = language === 'mr' 
                        ? getTranslation(`categories.${category.toLowerCase()}`, language) 
                        : category;
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedWeights([]);
                            setSelectedTypes([]);
                          }}
                          className={`text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-xs sm:text-sm ${
                            selectedCategory === category
                              ? "bg-coral text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {categoryLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-chocolate text-sm uppercase tracking-wide">
                    Size
                  </h3>
                </div>
                <div className="p-5 space-y-3">
                  {["0.5kg", "1kg", "2kg"].map((weight) => (
                    <label
                      key={weight}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedWeights.includes(weight)}
                          onChange={() => toggleWeight(weight)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedWeights.includes(weight)
                              ? "bg-coral border-coral"
                              : "border-gray-300 group-hover:border-coral"
                          }`}
                        >
                          {selectedWeights.includes(weight) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {weight}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-chocolate text-sm uppercase tracking-wide">
                    {language === 'mr' ? 'प्रकार' : 'Type'}
                  </h3>
                </div>
                <div className="p-5 space-y-3">
                  {["Egg", "Eggless"].map((type) => {
                    const typeLabel = language === 'mr'
                      ? (type === 'Egg' ? getTranslation('egg', language) : getTranslation('eggless', language))
                      : type;
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              selectedTypes.includes(type)
                                ? "bg-coral border-coral"
                                : "border-gray-300 group-hover:border-coral"
                            }`}
                          >
                            {selectedTypes.includes(type) && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {typeLabel}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Reset Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full px-5 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  RESET ALL FILTERS
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-bold text-gray-900 text-sm sm:text-lg">{filteredCakes.length}</span>
                <span className="ml-1">{language === 'mr' ? (filteredCakes.length !== 1 ? "केक" : "केक") : (filteredCakes.length !== 1 ? "cakes" : "cake")}</span>
                {selectedCategory !== "All" && (
                  <span className="ml-1 text-gray-500">
                    {language === 'mr' ? 'मध्ये' : 'in'} {language === 'mr' 
                      ? getTranslation(`categories.${selectedCategory.toLowerCase()}`, language)
                      : selectedCategory
                    }
                  </span>
                )}
              </p>
            </div>

            {/* Grid */}
            {filteredCakes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredCakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20 bg-white rounded-lg sm:rounded-2xl border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Filter size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                    {getTranslation("noResults", language)}
                  </h3>
                  <p className="text-xs sm:text-base text-gray-600 mb-4 sm:mb-6">
                    {language === 'mr'
                      ? "अधिक परिणाम पाहण्यासाठी आपल्या फिल्टर समायोजित करने का प्रयास करा"
                      : "Try adjusting your filters to see more results"
                    }
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-coral text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    {getTranslation("resetFilters", language)}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}