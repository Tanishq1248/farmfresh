"use client";
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';
import { useState } from 'react';
import { LogOut, User, LogIn, LayoutGrid } from 'lucide-react';

export const AuthCard = () => {
  const { user, authLoading, handleLogout } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user.email?.split('@')[0]}</p>
          <p className="text-xs text-gray-500">{user.isAdmin ? 'Admin' : 'User'}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            title="Account Menu"
          >
            <User size={20} className="text-green-600" />
        </button>

          {isOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg p-2 z-50">
              {user.isAdmin && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm font-medium"
                  >
                    <LayoutGrid size={16} />
                    Admin Dashboard
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                </>
              )}
              <button
                onClick={async () => {
                  await handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className="flex items-center gap-2 px-3 py-1.5 text-green-600 hover:text-green-700 font-medium text-sm"
      >
        <LogIn size={18} />
        Sign In
      </Link>
      <Link
        href="/signup"
        className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
      >
        Sign Up
      </Link>
    </div>
  );
};
