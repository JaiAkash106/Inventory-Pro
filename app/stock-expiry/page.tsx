'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, Calendar, Package, Filter, X, Search, ChevronDown, Bell } from 'lucide-react'

interface Product {
  _id: string
  name: string
  category: string
  quantity: number
  price: number
  lowStockThreshold: number
  expiryDate?: string
  imageUrl?: string
  sku: string
}

interface StockStats {
  lowStock: number
  expiringSoon: number
  expired: number
  total: number
}

interface FilterOptions {
  category: string
  stockStatus: string
  expiryStatus: string
  searchQuery: string
}

interface Notification {
  id: string
  type: 'low_stock' | 'expiring_soon' | 'expired'
  message: string
  productId: string
  productName: string
  timestamp: Date
  priority: 'high' | 'medium' | 'low'
}

export default function StockExpiryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<StockStats>({
    lowStock: 0,
    expiringSoon: 0,
    expired: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    stockStatus: 'all',
    expiryStatus: 'all',
    searchQuery: ''
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetchProducts()
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(fetchProducts, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        // API might return an array or an object with a `products` property.
        const productsData = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : []

        setProducts(productsData)
        calculateStats(productsData)
        generateNotifications(productsData)
        console.log('📦 Products loaded (stock-expiry):', productsData.length, { sourceShape: Array.isArray(data) ? 'array' : data && data.products ? 'object.products' : 'unknown' })
      } else {
        console.error('Failed to fetch products:', response.status)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (productsData: Product[]) => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const lowStock = productsData.filter(p => p.quantity <= p.lowStockThreshold).length
    const expiringSoon = productsData.filter(p => 
      p.expiryDate && new Date(p.expiryDate) <= sevenDaysFromNow && new Date(p.expiryDate) > now
    ).length
    const expired = productsData.filter(p => 
      p.expiryDate && new Date(p.expiryDate) <= now
    ).length

    setStats({
      lowStock,
      expiringSoon,
      expired,
      total: productsData.length
    })
  }

  const generateNotifications = (productsData: Product[]) => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const newNotifications: Notification[] = []

    productsData.forEach(product => {
      // Low stock notifications
      if (product.quantity <= product.lowStockThreshold) {
        newNotifications.push({
          id: `low-${product._id}`,
          type: 'low_stock',
          message: `${product.name} is running low! Current stock: ${product.quantity}, Threshold: ${product.lowStockThreshold}`,
          productId: product._id,
          productName: product.name,
          timestamp: new Date(),
          priority: product.quantity === 0 ? 'high' : 'medium'
        })
      }

      // Expiry notifications
      if (product.expiryDate) {
        const expiryDate = new Date(product.expiryDate)
        const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysRemaining <= 0) {
          newNotifications.push({
            id: `expired-${product._id}`,
            type: 'expired',
            message: `${product.name} has expired! Expired on ${expiryDate.toLocaleDateString()}`,
            productId: product._id,
            productName: product.name,
            timestamp: new Date(),
            priority: 'high'
          })
        } else if (daysRemaining <= 7) {
          newNotifications.push({
            id: `expiring-${product._id}`,
            type: 'expiring_soon',
            message: `${product.name} expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} (${expiryDate.toLocaleDateString()})`,
            productId: product._id,
            productName: product.name,
            timestamp: new Date(),
            priority: daysRemaining <= 3 ? 'high' : 'medium'
          })
        }
      }
    })

    // Sort by priority and timestamp
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority] || 
             b.timestamp.getTime() - a.timestamp.getTime()
    })

    setNotifications(newNotifications)
  }

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="text-amber-600" size={16} />
      case 'expiring_soon': return <Clock className="text-orange-600" size={16} />
      case 'expired': return <Calendar className="text-red-600" size={16} />
      default: return <AlertTriangle size={16} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'low_stock': return 'bg-amber-50 border-amber-200'
      case 'expiring_soon': return 'bg-orange-50 border-orange-200'
      case 'expired': return 'bg-red-50 border-red-200'
      default: return 'bg-slate-50 border-slate-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-slate-500'
    }
  }

  // Get unique categories for filter dropdown (guard in case products is not an array)
  const categories = ['all', ...Array.from(new Set((Array.isArray(products) ? products : []).map(p => p.category)))]

  // Filter products based on current filters (guard if products isn't an array)
  const getFilteredProducts = () => {
    const source = Array.isArray(products) ? products : []
    return source.filter(product => {
      // Search filter
      const matchesSearch = filters.searchQuery === '' || 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.searchQuery.toLowerCase())
      
      // Category filter
      const matchesCategory = filters.category === 'all' || product.category === filters.category
      
      // Stock status filter
      let matchesStock = true
      if (filters.stockStatus !== 'all') {
        if (filters.stockStatus === 'low') {
          matchesStock = product.quantity <= product.lowStockThreshold
        } else if (filters.stockStatus === 'adequate') {
          matchesStock = product.quantity > product.lowStockThreshold
        }
      }

      // Expiry status filter
      let matchesExpiry = true
      if (filters.expiryStatus !== 'all' && product.expiryDate) {
        const daysRemaining = getDaysRemaining(product.expiryDate)
        if (filters.expiryStatus === 'expiring') {
          matchesExpiry = daysRemaining > 0 && daysRemaining <= 7
        } else if (filters.expiryStatus === 'expired') {
          matchesExpiry = daysRemaining <= 0
        } else if (filters.expiryStatus === 'safe') {
          matchesExpiry = daysRemaining > 7
        }
      } else if (filters.expiryStatus !== 'all' && !product.expiryDate) {
        matchesExpiry = false
      }

      return matchesSearch && matchesCategory && matchesStock && matchesExpiry
    })
  }

  const filteredProducts = getFilteredProducts()

  // Get products for each table
  const allProductsWithExpiry = filteredProducts.filter(p => p.expiryDate)
  const lowStockProducts = filteredProducts.filter(p => p.quantity <= p.lowStockThreshold)
  const expiringSoonProducts = filteredProducts.filter(p => {
    if (!p.expiryDate) return false
    const daysRemaining = getDaysRemaining(p.expiryDate)
    return daysRemaining > 0 && daysRemaining <= 7
  })
  const expiredProducts = filteredProducts.filter(p => {
    if (!p.expiryDate) return false
    return getDaysRemaining(p.expiryDate) <= 0
  })

  const clearFilters = () => {
    setFilters({
      category: 'all',
      stockStatus: 'all',
      expiryStatus: 'all',
      searchQuery: ''
    })
  }

  const hasActiveFilters = filters.category !== 'all' || filters.stockStatus !== 'all' || 
                          filters.expiryStatus !== 'all' || filters.searchQuery !== ''

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Stock & Expiry Monitor</h1>
            <p className="text-slate-600">Track inventory levels and product expiration dates</p>
          </div>
          <div className="flex gap-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors relative"
              >
                <Bell size={16} />
                Alerts
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Bell size={16} />
                      Stock Alerts ({notifications.length})
                    </h3>
                  </div>
                  <div className="p-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Bell className="mx-auto mb-2 text-slate-400" size={24} />
                        No alerts at the moment
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 border rounded-lg mb-2 ${getNotificationColor(notification.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></span>
                                <span className="text-sm font-medium text-slate-900 capitalize">
                                  {notification.type.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-500 ml-auto">
                                  {notification.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">{notification.message}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                Product: {notification.productName}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter size={16} />
              Filters
              {hasActiveFilters && (
                <span className="bg-slate-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[
                    filters.category !== 'all',
                    filters.stockStatus !== 'all',
                    filters.expiryStatus !== 'all',
                    filters.searchQuery !== ''
                  ].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-slate-900">Filter Products</h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-1 rounded border border-slate-300 hover:border-slate-400"
              >
                <X size={16} />
                Clear all filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 appearance-none bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Stock Level</label>
                <div className="relative">
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 appearance-none bg-white"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="low">Low Stock (≤ threshold)</option>
                    <option value="adequate">Adequate Stock</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Expiry Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Expiry Status</label>
                <div className="relative">
                  <select
                    value={filters.expiryStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, expiryStatus: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 appearance-none bg-white"
                  >
                    <option value="all">All Expiry Status</option>
                    <option value="expiring">Expiring Soon (1-7 days)</option>
                    <option value="expired">Expired</option>
                    <option value="safe">Not Expiring Soon (&gt;7 days)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-2">
                  {filters.searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Search: "{filters.searchQuery}"
                      <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.category !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Category: {filters.category}
                      <button onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.stockStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                      Stock: {filters.stockStatus === 'low' ? 'Low Stock' : 'Adequate Stock'}
                      <button onClick={() => setFilters(prev => ({ ...prev, stockStatus: 'all' }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.expiryStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      Expiry: {filters.expiryStatus === 'expiring' ? 'Expiring Soon' : filters.expiryStatus === 'expired' ? 'Expired' : 'Not Expiring Soon'}
                      <button onClick={() => setFilters(prev => ({ ...prev, expiryStatus: 'all' }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> of <span className="font-semibold text-slate-900">{products.length}</span> products
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Low Stock</p>
              <p className="text-3xl font-semibold text-slate-900">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <AlertTriangle className="text-amber-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Items below threshold</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Expiring Soon</p>
              <p className="text-3xl font-semibold text-slate-900">{stats.expiringSoon}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Within 7 days</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Expired</p>
              <p className="text-3xl font-semibold text-slate-900">{stats.expired}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Calendar className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Past expiration</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Products</p>
              <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <Package className="text-slate-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">In inventory</p>
        </div>
      </div>

      {/* Table 1: All Products with Expiry Dates */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Package className="text-slate-600" size={20} />
                All Products with Expiry Dates
                <span className="bg-slate-100 text-slate-800 text-sm px-2 py-1 rounded-full">
                  {allProductsWithExpiry.length}
                </span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">Products that have expiry dates set</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Days Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allProductsWithExpiry.map((product) => {
                const daysRemaining = getDaysRemaining(product.expiryDate!)
                const isLowStock = product.quantity <= product.lowStockThreshold
                
                return (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(product.expiryDate!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        daysRemaining <= 0 ? 'bg-red-100 text-red-800' : 
                        daysRemaining <= 3 ? 'bg-orange-100 text-orange-800' : 
                        daysRemaining <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {daysRemaining <= 0 ? 'Expired' : `${daysRemaining} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'Adequate'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {allProductsWithExpiry.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <Package className="mx-auto text-slate-400 mb-2" size={32} />
                    No products with expiry dates match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Low Stock Products */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={20} />
                Low Stock Products
                <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full">
                  {lowStockProducts.length}
                </span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">Products below their stock threshold</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Shortage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lowStockProducts.map((product) => {
                const shortage = product.lowStockThreshold - product.quantity
                const severity = product.quantity === 0 ? 'Out of Stock' : 
                               shortage > 10 ? 'Critical' : 'Warning'
                
                return (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.lowStockThreshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{shortage}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.quantity === 0 ? 'bg-red-100 text-red-800' :
                        shortage > 10 ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {severity}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <AlertTriangle className="mx-auto text-slate-400 mb-2" size={32} />
                    No low stock products match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Expiring Soon Products */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="text-orange-600" size={20} />
                Expiring Soon (1-7 days)
                <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                  {expiringSoonProducts.length}
                </span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">Products expiring within the next week</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Days Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expiringSoonProducts.map((product) => {
                const daysRemaining = getDaysRemaining(product.expiryDate!)
                const urgency = daysRemaining <= 3 ? 'High' : daysRemaining <= 5 ? 'Medium' : 'Low'
                
                return (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(product.expiryDate!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{daysRemaining}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        urgency === 'High' ? 'bg-red-100 text-red-800' :
                        urgency === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {urgency} Priority
                      </span>
                    </td>
                  </tr>
                )
              })}
              {expiringSoonProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <Clock className="mx-auto text-slate-400 mb-2" size={32} />
                    No products expiring soon match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 4: Expired Products */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="text-red-600" size={20} />
                Expired Products
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                  {expiredProducts.length}
                </span>
              </h2>
              <p className="text-slate-600 text-sm mt-1">Products that have passed their expiration date</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expiredProducts.map((product) => {
                const daysOverdue = Math.abs(getDaysRemaining(product.expiryDate!))
                
                return (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(product.expiryDate!).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{daysOverdue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Remove from Inventory
                      </span>
                    </td>
                  </tr>
                )
              })}
              {expiredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <Calendar className="mx-auto text-slate-400 mb-2" size={32} />
                    No expired products match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}