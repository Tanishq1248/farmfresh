"use client";
import { AdminProtectedRoute } from '@/app/components/AdminProtectedRoute';
import { AdminLayout } from '@/app/components/AdminLayout';
import { useAppContext } from '@/app/context/AppContext';
import { Plus, Trash2, Edit, X, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

const AdminProductsContent = () => {
  const { products, setProducts, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    category: 'Vegetables',
    unit: 'per kg',
    price: '',
    originalPrice: '',
    inStock: true,
    featured: false,
  });

  // Function to refresh products from API
  const refreshProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setProducts?.(result.data);
        }
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.originalPrice) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setLoading(false);
        return;
      }

      const currentPrice = parseFloat(formData.price) || parseFloat(formData.originalPrice);
      const originalPrice = parseFloat(formData.originalPrice);
      const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

      const productData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        category: formData.category,
        unit: formData.unit,
        price: currentPrice,
        originalPrice: originalPrice,
        discount: discount,
        inStock: formData.inStock,
        featured: formData.featured,
      };

      if (editingId) {
        // Update existing product via API
        const response = await fetch(`/api/products?id=${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update product');
        }

        // Update in context
        updateProduct?.(parseInt(editingId), { id: editingId, ...productData });
        setMessage({ type: 'success', text: 'Product updated successfully!' });
        setEditingId(null);
      } else {
        // Create new product via API
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create product');
        }

        const result = await response.json();
        
        // Add to context with the API response (which includes the ID)
        if (result.data) {
          setProducts?.((prev: any) => [result.data, ...prev]);
        }

        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      setFormData({
        name: '',
        description: '',
        image: '',
        category: 'Vegetables',
        unit: 'per kg',
        price: '',
        originalPrice: '',
        inStock: true,
        featured: false,
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save product. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      image: product.image || '',
      category: product.category,
      unit: product.unit,
      price: product.currentPrice?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      inStock: product.inStock,
      featured: product.featured,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      category: 'Vegetables',
      unit: 'per kg',
      price: '',
      originalPrice: '',
      inStock: true,
      featured: false,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      // Delete from context
      deleteProduct?.(parseInt(productId));
      
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to delete product. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 md:gap-4">
        <h2 className="text-base md:text-2xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Manage Products</h2>
        {!showModal && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 md:gap-2 bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-xs md:text-base whitespace-nowrap"
          >
            <Plus size={16} className="md:size-5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-base md:text-xl font-bold text-gray-800">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              {/* Product Image Upload */}
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">Product Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:bg-green-50 transition-colors group"
                >
                  {formData.image ? (
                    <div className="space-y-2">
                      <img src={formData.image} alt="Product" className="w-32 h-32 object-cover rounded mx-auto" />
                      <p className="text-xs text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-green-400 mx-auto mb-2 group-hover:text-green-500" />
                      <p className="text-green-600 font-medium">Click to upload</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Organic Avocados"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Short description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm resize-none h-24"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm"
                  >
                    <option value="per kg">per kg</option>
                    <option value="per piece">per piece</option>
                    <option value="per dozen">per dozen</option>
                    <option value="per liter">per liter</option>
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    placeholder="0.00"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 block mb-1">Discounted Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Leave blank for no discount"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8 py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.inStock ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.inStock ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.featured ? 'translate-x-6' : ''}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-3 md:p-6 border border-green-100 overflow-hidden">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No products yet. Click "Add Product" to create one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-linear-to-r from-green-50 to-blue-50 border-b border-green-100">
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap text-xs">Product</th>
                  <th className="hidden sm:table-cell px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap text-xs">Category</th>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap text-xs">Price</th>
                  <th className="hidden md:table-cell px-2 md:px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap text-xs">Status</th>
                  <th className="px-2 md:px-4 py-2 text-center font-semibold text-gray-700 whitespace-nowrap text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-t border-green-50 hover:bg-green-50/50 transition-colors">
                    <td className="px-2 md:px-4 py-2 md:py-3">
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-8 h-8 md:w-10 md:h-10 rounded object-cover" />
                        )}
                        <span className="text-gray-800 font-medium truncate text-xs md:text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm truncate">{product.category}</td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-gray-800 font-semibold text-xs md:text-sm whitespace-nowrap">${product.currentPrice || product.price}</td>
                    <td className="hidden md:table-cell px-2 md:px-4 py-2 md:py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-block ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 flex gap-1 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-linear-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white p-1 md:p-1.5 rounded transition-all shadow-sm hover:shadow-md shrink-0"
                      >
                        <Edit size={12} className="md:size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-linear-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white p-1 md:p-1.5 rounded transition-all shadow-sm hover:shadow-md shrink-0"
                      >
                        <Trash2 size={12} className="md:size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminProducts() {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminProductsContent />
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
