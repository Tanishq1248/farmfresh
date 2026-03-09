"use client";
import { AdminProtectedRoute } from '@/app/components/AdminProtectedRoute';
import { AdminLayout } from '@/app/components/AdminLayout';
import AdminDashboard from '@/app/components/AdminDashboard';
import { useAppContext } from '@/app/context/AppContext';
import { ShoppingCart, Package, Tag, TrendingUp } from 'lucide-react';

const AdminDashboardContent = () => {
  const { products, offers, orders, firebaseConnected } = useAppContext();

  // Calculate stats
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalOffers = offers.length;

  const recentProducts = products.slice(0, 5);
  const activeOffers = offers.slice(0, 3);

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={totalOrders}
          bgColor="from-blue-100 to-cyan-100"
          iconColor="from-blue-400 to-cyan-500"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts}
          bgColor="from-green-100 to-emerald-100"
          iconColor="from-green-400 to-emerald-500"
        />
        <StatCard
          icon={Tag}
          label="Active Offers"
          value={totalOffers}
          bgColor="from-purple-100 to-pink-100"
          iconColor="from-purple-400 to-pink-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          bgColor="from-orange-100 to-amber-100"
          iconColor="from-orange-400 to-amber-500"
        />
      </div>

      {/* Recent Products */}
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-3 md:p-6 border border-green-100 overflow-hidden">
        <h3 className="text-base md:text-xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3 md:mb-4">Recent Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-linear-to-r from-green-50 to-blue-50 border-b border-green-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Product</th>
                <th className="hidden sm:table-cell px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Category</th>
                <th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Price</th>
                <th className="hidden md:table-cell px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Discount</th>
                <th className="hidden lg:table-cell px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Rating</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product: any) => (
                <tr key={product.id} className="border-t border-green-50 hover:bg-green-50/50 transition-colors">
                  <td className="px-2 md:px-4 py-2 md:py-3 text-gray-800 font-medium truncate text-xs md:text-sm">{product.name}</td>
                  <td className="hidden sm:table-cell px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs">{product.category}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-gray-800 font-semibold text-xs md:text-sm">₹{product.price}</td>
                  <td className="hidden md:table-cell px-2 md:px-4 py-2 md:py-3">
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-medium inline-block">
                      {product.discount}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs">⭐ {product.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Offers */}
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-3 md:p-6 border border-purple-100 overflow-hidden">
        <h3 className="text-base md:text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 md:mb-4">Active Offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {activeOffers.map((offer: any) => (
            <div key={offer.id} className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-xs md:text-base">{offer.title}</h4>
              <p className="text-green-600 font-bold text-sm md:text-lg mb-2">{offer.discount}</p>
              <p className="text-xs md:text-sm text-gray-500">Ends: {offer.endDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  bgColor,
  iconColor,
}: {
  icon: any;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}) => (
  <div className={`bg-linear-to-br ${bgColor} rounded-xl shadow-md p-4 md:p-6 flex items-center gap-3 md:gap-4 border border-opacity-30 hover:shadow-lg transition-shadow`}>
    <div className={`bg-linear-to-br ${iconColor} p-2 md:p-3 rounded-lg flex items-center justify-center shrink-0`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-gray-600 text-xs md:text-sm font-medium">{label}</p>
      <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Dashboard Overview */}
          <div>
            <AdminDashboardContent />
          </div>

          {/* Inventory Management */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <AdminDashboard />
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
