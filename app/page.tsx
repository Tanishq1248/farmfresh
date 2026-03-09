"use client";
import React from 'react';
import { 
  Search, Heart, Package, LogIn, ShoppingCart, 
  ChevronLeft, ChevronRight, Grid, Apple, Carrot, Leaf,
  Star, X
} from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { useState, useEffect } from 'react';

// --- DEFAULT IMAGES ---
const defaultImages: { [key: string]: string } = {
  'Green Beans': 'https://images.unsplash.com/photo-1590005026620-1e5b5c927f8a?auto=format&fit=crop&q=80&w=300&h=200',
  'Sweet Potatoes': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300&h=200',
  'White Radish': 'https://images.unsplash.com/photo-1588665977926-cd242e88a313?auto=format&fit=crop&q=80&w=300&h=200',
  'Red Onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=300&h=200',
};

// --- COMPONENTS ---

const HeroBanner = () => {
  const { offers } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || !offers || offers.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [autoPlay, offers]);

  if (!offers || offers.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const currentOffer = offers[currentSlide];

  return (
    <div className="relative rounded-2xl md:rounded-3xl mx-4 md:mx-6 my-4 md:my-6 overflow-hidden h-32 sm:h-40 md:h-48 group">
      {/* Background gradient - yellow to green */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, #fef3c7 0%, #dbeafe 50%, #dcfce7 100%)',
          opacity: 1,
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-10">
        {/* Navigation arrow - left */}
        <button
          onClick={goToPrevious}
          className="shrink-0 bg-white bg-opacity-70 hover:bg-opacity-100 p-1.5 md:p-2 rounded-full shadow-md text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Previous offer"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Text content - center */}
        <div className="flex-1 px-4 sm:px-6 md:px-8 text-center animate-fade-up">
          {/* Badge */}
          <div className="inline-block mb-2 md:mb-3 animate-bounce-gentle">
            <span className="bg-green-700 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              HOT DEAL
            </span>
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 md:mb-2 leading-tight">
            {currentOffer.title}
          </h1>

          {/* Description */}
          {currentOffer.description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              {currentOffer.description}
            </p>
          )}
        </div>

        {/* Navigation arrow - right */}
        <button
          onClick={goToNext}
          className="shrink-0 bg-white bg-opacity-70 hover:bg-opacity-100 p-1.5 md:p-2 rounded-full shadow-md text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Next offer"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {offers.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setAutoPlay(false);
              setTimeout(() => setAutoPlay(true), 10000);
            }}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-green-600 w-2 h-2'
                : 'bg-gray-400 w-2 h-2 hover:bg-gray-500'
            }`}
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const FreshPicks = () => {
  // We pull in the context hooks right here inside the FreshPicks component!
  const { products, addToCart, toggleWishlist, wishlist } = useAppContext();
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, weight: 1 }); // Default 1kg
    setAddedItemId(product.id);
    setTimeout(() => setAddedItemId(null), 600);
  };

  // Function to calculate discount percentage
  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    if (!originalPrice || !currentPrice) return '0%';
    // Handle both Firebase field names (originalPrice, currentPrice) and API field names (originalPrice, price)
    const original = originalPrice || 0;
    const current = currentPrice || 0;
    if (original <= current) return '0%';
    const discount = Math.round(((original - current) / original) * 100);
    return `${discount}%`;
  };

  return (
    <>
      <div className="px-4 md:px-6 mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Fresh Picks</h2>
            <p className="text-gray-500 text-sm">Hand-selected, farm-fresh produce</p>
          </div>
          
          <div className="flex overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 min-w-max">
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white shadow-sm text-green-700 font-medium text-sm border border-gray-100 whitespace-nowrap">
                <Grid size={14} /> All
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-800 font-medium text-sm transition whitespace-nowrap">
                <Apple size={14} /> Fruits
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-gray-500 hover:text-gray-800 font-medium text-sm transition whitespace-nowrap">
                <Carrot size={14} /> Vegetables
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product: any) => {
            // Check if this specific product is already in the wishlist
            const isFavorited = wishlist.find((i: any) => i.id === product.id);
            
            // Use currentPrice for display (from Firebase), fallback to price (from API)
            const displayPrice = product.currentPrice || product.price;
            const originalPrice = product.originalPrice;
            
            // Calculate discount only if both prices exist and original > current
            const discount = calculateDiscount(originalPrice, displayPrice);
            const displayImage = product.image || defaultImages[product.name] || 'https://images.unsplash.com/photo-1590005026620-1e5b5c927f8a?auto=format&fit=crop&q=80&w=300&h=200';

            return (
              <div 
                key={product.id} 
                className="relative bg-white border border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col"
              >
                
                {/* Discount Badge - Only show if discount > 0% */}
                {discount !== '0%' && (
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md z-10 animate-pulse">
                    Save {discount}
                  </div>
                )}
                
                {/* Working Wishlist Button */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-2 right-2 md:top-4 md:right-4 transition z-10 bg-white rounded-full p-1 md:p-1.5 shadow-sm ${isFavorited ? 'text-red-500 opacity-100' : 'text-gray-300 opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}
                >
                  <Heart size={14} className="md:w-4.5 md:h-4.5" fill={isFavorited ? "currentColor" : "none"} />
                </button>

                <div 
                  className="w-full h-24 md:h-40 relative rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-4 bg-gray-50 shrink-0 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img src={displayImage} alt={product.name} className="w-full h-full object-cover mix-blend-multiply md:hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col grow justify-between">
                  <div>
                    <span className="text-[9px] md:text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5 md:mb-1 block">
                      {product.category}
                    </span>
                    <h3 
                      className="text-gray-900 font-bold mb-1 md:mb-1.5 text-sm md:text-lg truncate md:hover:text-green-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.name}
                    </h3>
                    
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2 md:mb-4">
                        <Star size={12} className="md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] md:text-xs text-gray-500 font-medium">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-1 md:pt-2">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-bold md:font-extrabold text-sm md:text-lg leading-tight">
                        ₹{displayPrice ? displayPrice.toFixed(0) : '0'}
                      </span>
                      {originalPrice && originalPrice !== displayPrice && (
                        <span className="text-gray-400 text-[10px] md:text-sm line-through decoration-gray-300">
                          ₹{originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                    
                    {/* Working Add to Cart Button with Animation */}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`relative p-1.5 md:p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        addedItemId === product.id
                          ? 'bg-green-600 text-white scale-125'
                          : 'bg-green-100 hover:bg-green-600 text-green-700 hover:text-white'
                      }`}
                    >
                      <ShoppingCart size={16} className="md:w-5 md:h-5" />
                      {/* Checkmark animation on add */}
                      {addedItemId === product.id && (
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* --- PRODUCT DETAIL MODAL WITH SMOOTH ANIMATION --- */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
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
                      src={selectedProduct.image || defaultImages[selectedProduct.name] || 'https://images.unsplash.com/photo-1590005026620-1e5b5c927f8a?auto=format&fit=crop&q=80&w=500&h=500'}
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
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{(selectedProduct.currentPrice || selectedProduct.price || 0).toFixed(0)}
                      </span>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice !== (selectedProduct.currentPrice || selectedProduct.price) && (
                        <>
                          <span className="text-2xl text-gray-400 line-through">
                            ₹{selectedProduct.originalPrice.toFixed(0)}
                          </span>
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            Save {calculateDiscount(selectedProduct.originalPrice, selectedProduct.currentPrice || selectedProduct.price)}
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
                        addToCart({ ...selectedProduct, weight: 1 });
                        setSelectedProduct(null);
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
    </>
  );
};

// --- MAIN PAGE ---

export default function Home() {
  return (
    <main className="bg-white rounded-3xl mt-4 p-4 shadow-sm">
      <HeroBanner />
      <FreshPicks />
    </main>
  );
}