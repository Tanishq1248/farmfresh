"use client";
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();

  if (wishlist.length === 0) return <div className="p-12 text-center text-gray-500 font-medium">Your wishlist is empty! ❤️</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product: any) => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm relative">
            <button onClick={() => toggleWishlist(product)} className="absolute top-4 right-4 text-red-500 z-10"><Heart fill="currentColor" size={20}/></button>
            <img src={product.image} className="w-full h-32 object-cover rounded-xl mb-4" />
            <h3 className="font-bold mb-2">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="font-bold">₹{product.price}</span>
              <button onClick={() => addToCart(product)} className="bg-green-100 text-green-700 p-2 rounded-lg"><ShoppingCart size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}