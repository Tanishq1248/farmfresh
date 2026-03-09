"use client";
import React, { useState, useEffect } from 'react';
import {
  Edit, Trash2, Plus, AlertCircle, Check, X,
  Search, Filter, Download, DollarSign, Gift,
  TrendingDown, Package, Leaf, Apple
} from 'lucide-react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  Product
} from '@/lib/firebase';
import { useAppContext } from '@/app/context/AppContext';

interface EditingProduct extends Partial<Product> {
  id?: string;
}

export default function AdminDashboard() {
  const { products, firebaseConnected } = useAppContext();
  const [editing, setEditing] = useState<EditingProduct | null>(null);
  const [formData, setFormData] = useState<EditingProduct>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Vegetables' | 'Fruits'>('All');
  const [showForm, setShowForm] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    if (!originalPrice || !currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleAddNew = () => {
    setEditing({});
    setFormData({
      name: '',
      category: 'Vegetables',
      originalPrice: 0,
      currentPrice: 0,
      discount: 0,
      unit: 'per kg',
      description: '',
      image: '',
      inStock: true,
      featured: false
    });
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData({ ...product });
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Calculate current price from original price and discount
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = parseFloat(e.target.value) || 0;
    const originalPrice = formData.originalPrice || 0;
    const currentPrice = originalPrice * (1 - discount / 100);
    
    setFormData(prev => ({
      ...prev,
      discount,
      currentPrice: Math.round(currentPrice * 100) / 100
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.name || !formData.originalPrice) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setLoading(false);
        return;
      }

      if (editing?.id) {
        // Update existing product
        await updateProduct(editing.id, {
          ...formData,
          updatedAt: Date.now()
        } as Partial<Product>);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        // Create new product
        await createProduct({
          name: formData.name!,
          category: formData.category as 'Vegetables' | 'Fruits',
          originalPrice: formData.originalPrice!,
          currentPrice: formData.currentPrice || formData.originalPrice,
          discount: formData.discount || 0,
          unit: formData.unit || 'per kg',
          description: formData.description,
          image: formData.image,
          inStock: formData.inStock !== false,
          featured: formData.featured === true
        });
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }

      setShowForm(false);
      setEditing(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({ type: 'error', text: 'Failed to save product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await deleteProduct(productId);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ type: 'error', text: 'Failed to delete product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (productId: string, currentPrice: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    const discount = calculateDiscount(product.originalPrice, currentPrice);
    
    try {
      await updateProduct(productId, { currentPrice, discount });
      setMessage({ type: 'success', text: 'Price updated successfully!' });
    } catch (error) {
      console.error('Error updating price:', error);
      setMessage({ type: 'error', text: 'Failed to update price. Please try again.' });
    }
  };

  if (!firebaseConnected) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Firebase Not Connected</p>
            <p className="text-sm text-blue-700">Please configure Firebase environment variables to use the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={handleAddNew}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <Package className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <Leaf className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Vegetables</p>
            <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.category === 'Vegetables').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <Apple className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Fruits</p>
            <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.category === 'Fruits').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <Gift className="w-8 h-8 text-orange-600" />
          <div>
            <p className="text-sm text-gray-600">On Discount</p>
            <p className="text-2xl font-bold text-gray-900">{products.filter((p: any) => p.discount > 0).length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="All">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editing?.id ? 'Edit Product' : 'Add New Product'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Green Beans"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category || 'Vegetables'}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount || 0}
                onChange={handleDiscountChange}
                min="0"
                max="100"
                step="1"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
              <input
                type="number"
                name="currentPrice"
                value={formData.currentPrice || ''}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit || ''}
                onChange={handleInputChange}
                placeholder="per kg"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Product description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock !== false}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured === true}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setFormData({});
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Original Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Current Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        product.category === 'Vegetables'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium">${product.originalPrice}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium">${product.currentPrice}</p>
                    </td>
                    <td className="px-4 py-3">
                      {product.discount > 0 ? (
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-medium">{product.discount}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        product.inStock
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
