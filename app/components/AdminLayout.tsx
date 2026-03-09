"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import {
  BarChart3,
  Package,
  Tag,
  ShoppingCart,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { handleLogout, user } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogoutClick = async () => {
    await handleLogout();
    router.push('/');
  };

  const menuItems = [
    { href: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/offers', icon: Tag, label: 'Offers' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen w-64 md:w-64 transform transition-smooth md:translate-x-0 z-40 md:z-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Sidebar Inner */}
        <div className="bg-gradient-to-b from-green-100 via-blue-50 to-purple-100 h-full flex flex-col shadow-lg rounded-r-xl md:rounded-none">
          {/* Logo */}
          <div className="p-4 md:p-6 border-b border-green-200 flex items-center justify-between flex-shrink-0">
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent truncate">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-green-200 rounded transition-smooth text-gray-700 btn-press active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base ${
                    active
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-100/60'
                  }`}
                >
                  <Icon size={18} className="md:size-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-3 md:p-4 border-t border-green-200 space-y-3 flex-shrink-0">
            {user && (
              <div className="text-xs text-gray-700 bg-white/40 rounded-lg p-2 md:p-3 backdrop-blur">
                <p className="font-semibold text-gray-800 truncate text-xs md:text-sm">{user.email}</p>
                <p className="text-gray-600 text-xs mt-1">Admin User</p>
              </div>
            )}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white rounded-lg transition-smooth text-xs md:text-sm font-medium justify-center shadow-md btn-press active:scale-95"
            >
              <LogOut size={16} className="md:size-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/60 backdrop-blur shadow-sm px-3 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-green-100 flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-green-100 rounded transition-smooth text-gray-700 flex-shrink-0 btn-press active:scale-90"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent truncate">
              {menuItems.find((item) => isActive(item.href, item.exact))?.label || 'Dashboard'}
            </h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-2 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
