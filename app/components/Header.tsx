"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, Package, LogIn, ShoppingCart, Leaf, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AuthCard } from './AuthCard';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, wishlist } = useAppContext();
  
  // Calculate total quantity in cart
  const totalQuantity = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);

  return (
    <header className="py-4 px-4 md:px-6 bg-white border-b border-gray-100 z-50 sticky top-0">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-green-600 font-bold text-xl cursor-pointer">
          <div className="bg-green-500 p-1.5 rounded-lg text-white"><Leaf size={24} /></div>
          <div className="flex flex-col leading-none text-gray-800">
            <span className="text-xl font-extrabold tracking-tight">FreshCart</span>
          </div>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">
          <Link href="/products" className="hidden md:block cursor-pointer hover:text-green-600 transition-colors font-medium text-sm">
            Products
          </Link>
          <Link href="/wishlist" className="hidden md:block cursor-pointer hover:text-green-600 relative transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>}
          </Link>
          <Link href="/orders" className="hidden md:block cursor-pointer hover:text-green-600 transition-colors"><Package size={20} /></Link>
          
          {/* Cart */}
          <Link href="/cart" className="relative hover:text-green-600 transition-colors">
            <ShoppingCart size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Checkout Button */}
          {totalQuantity > 0 && (
            <Link
              href="/checkout"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
            >
              Checkout
            </Link>
          )}

          {/* Auth Card */}
          <div className="hidden md:block">
            <AuthCard />
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden text-gray-600 hover:text-green-600 p-1 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-100 p-1 rounded transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-4 mb-8">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                <ShoppingCart size={20} /> Cart {totalQuantity > 0 && `(${totalQuantity})`}
              </Link>
              <Link 
                href="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                <Heart size={20} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
              <Link 
                href="/orders" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-3 font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                <Package size={20} /> My Orders
              </Link>
            </nav>

            {/* Mobile Checkout Button */}
            {totalQuantity > 0 && (
              <Link
                href="/checkout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors text-center mb-4"
              >
                Proceed to Checkout
              </Link>
            )}

            {/* Mobile Auth */}
            <div className="border-t border-gray-200 pt-4">
              <AuthCard />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}