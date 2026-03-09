"use client";
import { AdminProtectedRoute } from '@/app/components/AdminProtectedRoute';
import { AdminLayout } from '@/app/components/AdminLayout';
import { useAppContext } from '@/app/context/AppContext';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

const AdminOffersContent = () => {
  const { offers, deleteOffer, addOffer, updateOffer } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    endDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateOffer(editingId, formData);
      setEditingId(null);
    } else {
      addOffer(formData);
    }
    setFormData({ title: '', discount: '', endDate: '' });
    setShowForm(false);
  };

  const handleEdit = (offer: any) => {
    setFormData(offer);
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', discount: '', endDate: '' });
  };

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Add Offer Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-4">
        <h2 className="text-base md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Manage Offers</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-xs md:text-base whitespace-nowrap"
          >
            <Plus size={16} className="md:size-5" />
            <span className="hidden sm:inline">Add Offer</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Offer Form */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-3 md:p-6 border border-purple-100 overflow-hidden">
          <h3 className="text-base md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
            {editingId ? 'Edit Offer' : 'Add New Offer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Offer Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-2 md:px-4 py-1.5 md:py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/50 text-xs md:text-base"
              required
            />
            <input
              type="text"
              name="discount"
              placeholder="Discount (e.g., 10% Off, Buy 2 Get 1 Free)"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full px-2 md:px-4 py-1.5 md:py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/50 text-xs md:text-base"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-2 md:px-4 py-1.5 md:py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/50 text-xs md:text-base"
              required
            />
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-xs md:text-base"
              >
                {editingId ? 'Update Offer' : 'Add Offer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all shadow-md font-medium text-xs md:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Offers Grid */}
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-3 md:p-6 border border-purple-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {offers.map((offer: any) => (
            <div key={offer.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-2.5 md:p-4 hover:shadow-md transition-shadow flex flex-col">
              <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 line-clamp-2 text-xs md:text-base">{offer.title}</h4>
              <p className="text-green-600 font-bold text-sm md:text-lg mb-1 md:mb-2">{offer.discount}</p>
              <p className="text-xs text-gray-500 mb-2 md:mb-4">Ends: {offer.endDate}</p>
              <div className="flex gap-1 md:gap-2 mt-auto">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white p-1.5 md:p-2 rounded transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
                >
                  <Edit size={12} className="md:size-4" />
                  <span className="hidden sm:inline text-xs md:text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white p-1.5 md:p-2 rounded transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
                >
                  <Trash2 size={12} className="md:size-4" />
                  <span className="hidden sm:inline text-xs md:text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AdminOffers() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminOffersContent />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
