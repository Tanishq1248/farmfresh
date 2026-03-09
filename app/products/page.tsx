"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { Search, Heart, ShoppingCart, ChevronDown, Star, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  ratings: number[];
  inStock: boolean | null;
}

const ProductsPage = () => {
  const { products, addToCart, toggleWishlist, wishlist } = useAppContext();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    priceRange: [0, 500],
    ratings: [],
    inStock: null,
  });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p: any) => p.category))).filter(Boolean) as string[];
  }, [products]);

  // Get max price from products
  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p: any) => p.price || 0), 500);
  }, [products]);

  // Auto-suggestions based on product names and categories
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    
    if (value.length > 0) {
      const query = value.toLowerCase();
      const productSuggestions = products
        .map((p: any) => p.name)
        .filter((name: string) => name.toLowerCase().includes(query))
        .slice(0, 5);
      
      const categorySuggestions = (categories as string[])
        .filter((cat: string) => cat.toLowerCase().includes(query))
        .slice(0, 3);
      
      setSuggestions([...new Set([...productSuggestions, ...categorySuggestions])]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [products, categories]);

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchRating = filters.ratings.length === 0 || filters.ratings.some(r => product.rating && product.rating >= r);
      const matchStock = filters.inStock === null || product.inStock === filters.inStock;

      return matchSearch && matchCategory && matchPrice && matchRating && matchStock;
    });
  }, [products, filters]);

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, weight: 1 });
    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 600);
  };

  const calculateDiscount = (originalPrice: number, price: number) => {
    if (!originalPrice || !price) return '0%';
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `${discount}%`;
  };

  return (
    <main className="bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover fresh, quality products with advanced filtering</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* --- FILTERS SIDEBAR --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

              {/* Search Bar with Auto-suggestions */}
              <div className="mb-8">
                <div className="relative">
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="ml-2 bg-transparent w-full outline-none text-sm text-gray-900"
                    />
                  </div>
                  
                  {/* Auto-suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-50">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                        >
                          <Search size={14} className="inline mr-2 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  Category
                  <ChevronDown size={18} className="text-gray-400" />
                </h3>
                <div className="space-y-2">
                  {(categories as string[]).map((cat: string) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            categories: e.target.checked
                              ? [...prev.categories, cat]
                              : prev.categories.filter(c => c !== cat)
                          }));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{cat}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        ({products.filter((p: any) => p.category === cat).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Min: ₹{filters.priceRange[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= filters.priceRange[1]) {
                          setFilters(prev => ({
                            ...prev,
                            priceRange: [newMin, prev.priceRange[1]]
                          }));
                        }
                      }}
                      className="w-full accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Max: ₹{filters.priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= filters.priceRange[0]) {
                          setFilters(prev => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], newMax]
                          }));
                        }
                      }}
                      className="w-full accent-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.ratings.includes(rating)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            ratings: e.target.checked
                              ? [...prev.ratings, rating]
                              : prev.ratings.filter(r => r !== rating)
                          }));
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        {Array(rating).fill(0).map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-700 ml-2">{rating}+</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        inStock: e.target.checked ? true : null
                      }));
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => setFilters({
                  search: '',
                  categories: [],
                  priceRange: [0, maxPrice],
                  ratings: [],
                  inStock: null,
                })}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* --- PRODUCTS GRID --- */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product: any) => {
                  const isFavorited = wishlist.find((i: any) => i.id === product.id);
                  const discount = calculateDiscount(product.originalPrice, product.price);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col"
                    >
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="relative"
                      >
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md z-10">
                          Save {discount}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-sm transition ${
                            isFavorited ? 'text-red-500' : 'text-gray-300 md:opacity-0 md:group-hover:opacity-100'
                          }`}
                        >
                          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>

                        {/* Product Image */}
                        <div className="w-full h-32 md:h-48 bg-gray-100 overflow-hidden">
                          <img
                            src={product.image || `https://images.unsplash.com/photo-1590005026620-1e5b5c927f8a?auto=format&fit=crop&q=80&w=300&h=200`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="p-3 md:p-4 flex flex-col grow">
                        <span className="text-[9px] md:text-xs uppercase text-gray-400 font-semibold mb-1">
                          {product.category}
                        </span>
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="text-gray-900 font-bold text-sm md:text-base mb-2 line-clamp-2 hover:text-green-600 transition-colors"
                        >
                          {product.name}
                        </h3>

                        {product.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-500">{product.rating}</span>
                          </div>
                        )}

                        <div className="mt-auto pt-2 space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-900 font-bold text-base md:text-lg">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice !== product.price && (
                              <span className="text-gray-400 text-xs md:text-sm line-through">₹{product.originalPrice}</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium ${
                              addedItemId === product.id
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 hover:bg-green-600 text-green-700 hover:text-white'
                            }`}
                          >
                            <ShoppingCart size={16} />
                            {addedItemId === product.id ? 'Added!' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    categories: [],
                    priceRange: [0, maxPrice],
                    ratings: [],
                    inStock: null,
                  })}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex flex-col">
                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center h-80">
                    <img
                      src={selectedProduct.image || `https://images.unsplash.com/photo-1590005026620-1e5b5c927f8a?auto=format&fit=crop&q=80&w=500&h=500`}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="inline-block">
                    <span className="text-xs uppercase font-semibold text-gray-400 mb-2 block">
                      {selectedProduct.category}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  {/* Rating */}
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      {Array(Math.round(selectedProduct.rating)).fill(0).map((_, i) => (
                        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-gray-600 text-sm ml-2">({selectedProduct.rating} out of 5)</span>
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-gray-900">₹{selectedProduct.price}</span>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice !== selectedProduct.price && (
                        <>
                          <span className="text-2xl text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            Save {calculateDiscount(selectedProduct.originalPrice, selectedProduct.price)}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{selectedProduct.unit || 'per kg'}</p>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-lg font-medium text-sm ${
                      selectedProduct.inStock
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedProduct.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setTimeout(() => setSelectedProduct(null), 600);
                      }}
                      className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                        wishlist.find((i: any) => i.id === selectedProduct.id)
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={20} fill={wishlist.find((i: any) => i.id === selectedProduct.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.category}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Unit</p>
                  <p className="font-semibold text-gray-900">{selectedProduct.unit || 'per kg'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;
