'use client'

import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, DollarSign, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function fetchDashboardStats() {
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats')
  }
  return response.json()
}

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Failed to load dashboard</h3>
          <p className="mt-2 text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stats?.lowStockProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ${stats?.totalValue?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
=======
         {/* 🛑 NEW: Expired Items Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" /> {/* Clock or Trash2 icon works well here */}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired Items</p>
              <p className="mt-1 text-2xl font-semibold text-red-600">{stats?.expiredItems || 0}</p>
            </div>
          </div>
        </div>

        {/* 🛑 NEW: Expiring Soon Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-600">{stats?.expiringSoonItems || 0}</p>
            </div>
          </div>
        </div>
        
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
        {/* Growth Metric */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <p className="mt-1 text-sm text-gray-600">Latest additions to your inventory</p>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recentProducts?.map((product: any) => (
              <div key={product._id || product.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                      <p className={`text-sm ${product.quantity < 10 ? 'text-red-600' : 'text-gray-500'}`}>
<<<<<<< HEAD
                        {product.quantity} units in stock
                      </p>
                      {/* EXPIRY DATE ADDED HERE */}
                      <p className="text-sm text-gray-500">
                        Expires: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'No expiry'}
=======
                        {product.quantity} in stock
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
<<<<<<< HEAD
                      Added: {new Date(product.createdAt).toLocaleDateString()}
=======
                      {new Date(product.createdAt).toLocaleDateString()}
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="p-6 text-center text-gray-500">
                No recent products found
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <Link
              href="/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              View all products
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-white">
          <h3 className="font-medium mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/products/add"
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span>Add Product</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/reports"
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span>Generate Report</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products?filter=low-stock"
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span>View Low Stock</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}