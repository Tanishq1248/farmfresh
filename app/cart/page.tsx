"use client";
import React from 'react';
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCart } = useAppContext();
  const total = cart.reduce((sum: number, item: any) => sum + (item.currentPrice || item.price || 0) * (item.quantity || 1), 0);
  const tax = Math.round(total * 0.1 * 100) / 100;
  const deliveryFee = total > 500 ? 0 : 50;
  const grandTotal = Math.round((total + tax + deliveryFee) * 100) / 100;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Shopping
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some fresh products to get started!</p>
            <Link
              href="/"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Shopping
        </Link>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                <div className="flex gap-4">
                  {/* Product Image */}
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                  )}

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.category} • {item.unit}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-900">₹{(item.currentPrice || item.price)?.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1  border border-gray-300">
                        <button
                          onClick={() => updateCart(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                          className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity || 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val > 0) updateCart(item.id, val);
                          }}
                          className="w-10 text-center font-bold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1"
                        />
                        <button
                          onClick={() => updateCart(item.id, (item.quantity || 1) + 1)}
                          className="p-1 hover:bg-white rounded transition-colors text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{((item.currentPrice || item.price) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">{item.name} ×{item.quantity || 1}</span>
                    <span className="font-semibold text-gray-900">₹{((item.currentPrice || item.price) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
              </div>

              {deliveryFee === 0 && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center font-medium">
                  Free Delivery!
                </div>
              )}

              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-green-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}