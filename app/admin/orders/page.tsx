"use client";
import { AdminProtectedRoute } from '@/app/components/AdminProtectedRoute';
import { AdminLayout } from '@/app/components/AdminLayout';
import { useAppContext } from '@/app/context/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const AdminOrdersContent = () => {
  const { orders } = useAppContext();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  if (orders.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-4 md:p-8 text-center border border-blue-100">
        <p className="text-gray-500 text-xs md:text-lg">No orders yet. Orders will appear here when customers place them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-6">
      <h2 className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Orders</h2>

      <div className="space-y-2 md:space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white/70 backdrop-blur rounded-xl shadow-sm md:shadow-md overflow-hidden border border-blue-100 hover:shadow-md transition-shadow">
            {/* Order Header */}
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              className="w-full px-2 md:px-6 py-2.5 md:py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors gap-2"
            >
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-xs md:text-base truncate">Order #{order.id}</p>
                <p className="text-xs text-gray-500 hidden sm:block">Date: {order.date}</p>
                <p className="text-xs text-gray-500 sm:hidden">{order.date}</p>
              </div>
              <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-xs md:text-base">₹{order.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.items.length} items</p>
                </div>
                {expandedOrder === order.id ? (
                  <ChevronUp className="text-gray-600 flex-shrink-0" size={18} />
                ) : (
                  <ChevronDown className="text-gray-600 flex-shrink-0" size={18} />
                )}
              </div>
            </button>

            {/* Order Details */}
            {expandedOrder === order.id && (
              <div className="border-t border-blue-100 px-2 md:px-6 py-3 md:py-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-xs md:text-base">Order Items</h4>
                <div className="space-y-2 md:space-y-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-xs md:text-sm bg-white/50 rounded-lg p-2 md:p-3 gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-800 font-medium truncate text-xs md:text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-gray-800 text-xs md:text-sm flex-shrink-0 whitespace-nowrap">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-blue-200 flex justify-between items-center font-bold text-xs md:text-base gap-2">
                  <p className="text-gray-800">Total:</p>
                  <p className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex-shrink-0 whitespace-nowrap">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminOrders() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminOrdersContent />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
