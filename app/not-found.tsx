"use client";

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-6 shadow-lg">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-4 text-left">What you can do:</h3>
          <ul className="text-gray-600 text-sm space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="text-blue-500">✓</span>
              Check the URL for typos
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">✓</span>
              Use the search feature to find what you need
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-500">✓</span>
              Return to the home page and browse from there
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Need further assistance?{' '}
            <a href="mailto:support@freshcart.com" className="text-green-600 hover:text-green-700 font-semibold">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
