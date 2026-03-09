"use client";

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-transparent bg-linear-to-r from-red-400 to-orange-600 bg-clip-text">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-6 shadow-lg">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Server Error
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Oops! Something went wrong on our end. Our team has been notified and is working to fix it.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-h-40 overflow-y-auto text-left">
            <h3 className="font-semibold text-red-900 mb-2 text-sm">Error Details:</h3>
            <p className="text-red-800 text-xs font-mono wrap-break-word">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-red-700 text-xs mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Recovery Tips */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-red-100">
          <h3 className="font-semibold text-gray-900 mb-4 text-left">Try these steps:</h3>
          <ul className="text-gray-600 text-sm space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">✓</span>
              Refresh the page to try again
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">✓</span>
              Clear your browser cache and cookies
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">✓</span>
              Try again in a few moments
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-3">
            If the problem persists, try contacting our support team
          </p>
          <a
            href="mailto:support@freshcart.com"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
