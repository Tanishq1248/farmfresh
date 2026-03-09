"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import { ArrowLeft, Package, MapPin, Phone, Calendar, Loader } from 'lucide-react';

export default function Orders() {
  const router = useRouter();
  const { orders, user, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 py-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view orders</h2>
            <p className="text-gray-600 mb-6">Please sign in to your account to view your order history</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/signin"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="border border-green-500 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to place your first order</p>
            <Link
              href="/"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Order #{order.id}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-green-600">${order.total?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Delivery Information */}
                {(order.deliveryAddress || order.phoneNumber) && (
                  <div className="grid sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                    {order.deliveryAddress && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MapPin size={18} className="text-green-600" />
                          Delivery Address
                        </h4>
                        <div className="text-gray-700 text-sm space-y-1">
                          <p className="font-medium">{order.firstName} {order.lastName}</p>
                          <p>{order.deliveryAddress}</p>
                          <p>{order.deliveryCity}, {order.deliveryState} {order.deliveryZip}</p>
                        </div>
                      </div>
                    )}
                    {order.phoneNumber && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Phone size={18} className="text-green-600" />
                          Contact Information
                        </h4>
                        <div className="text-gray-700 text-sm space-y-1">
                          <p><strong>Phone:</strong> {order.phoneNumber}</p>
                          {order.email && <p><strong>Email:</strong> {order.email}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Items Ordered</h4>
                  <div className="space-y-3">
                    {order.items && order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">×{item.quantity || 1}</p>
                          <p className="font-semibold text-gray-800">${((item.currentPrice || item.price) * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <div className="w-full sm:w-64 space-y-2">
                      {order.items && (
                        <>
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span>${(order.items.reduce((sum: number, item: any) => sum + (item.currentPrice || item.price) * (item.quantity || 1), 0)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Tax (10%):</span>
                            <span>${((order.items.reduce((sum: number, item: any) => sum + (item.currentPrice || item.price) * (item.quantity || 1), 0) * 0.1).toFixed(2))}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between font-bold text-lg text-green-600 pt-2 border-t border-gray-300">
                        <span>Total:</span>
                        <span>${order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}