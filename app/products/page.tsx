'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

<<<<<<< HEAD
async function fetchProducts({ search = '', category = '' }) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (category) params.append('category', category)
  
  const response = await fetch(`/api/products?${params.toString()}`)
  if (!response.ok) {
    // Try to read error body for better debugging
    let msg = 'Failed to fetch products'
    try {
      const err = await response.json()
      msg = err?.message || msg
    } catch (e) {
      // ignore
    }
    throw new Error(msg)
  }

  const data = await response.json()
  // API returns either an array or an object like { products, pagination }
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.products)) return data.products
  // If shape is unexpected return empty array
  console.warn('fetchProducts: unexpected response shape', data)
  return []
}

async function deleteProduct(id: string) {
  const response = await fetch(`/api/products?id=${id}`, {
=======
async function fetchProducts({ search = '', category = '', page = 1 }) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (category) params.append('category', category)
  params.append('page', page.toString())
  
  const response = await fetch(`/api/products?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

async function deleteProduct(id: string) {
  const response = await fetch(`/api/products/${id}`, {
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
  return response.json()
}

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
<<<<<<< HEAD
  const [deleteProductItem, setDeleteProductItem] = useState<any>(null)
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory],
    queryFn: () => fetchProducts({ 
      search: searchTerm, 
      category: selectedCategory
=======
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteProductItem, setDeleteProductItem] = useState<any>(null)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, currentPage],
    queryFn: () => fetchProducts({ 
      search: searchTerm, 
      category: selectedCategory,
      page: currentPage
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete product')
    }
  })

<<<<<<< HEAD
  const categories = ['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books', 'Food', 'Home & Garden', 'Health & Beauty', 'Sports', 'Other']
=======
  const categories = ['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books']
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Products</h2>
        <p className="text-gray-600 dark:text-gray-400">Please try again later.</p>
      </div>
    )
  }

<<<<<<< HEAD
=======
  const products = data?.products || []
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 }

>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your inventory products</p>
        </div>
        <Link
          href="/products/add"
<<<<<<< HEAD
          className="btn-primary inline-flex items-center mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
=======
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
<<<<<<< HEAD
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
=======
      <div className="card p-4">
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
<<<<<<< HEAD
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
=======
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700"
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
<<<<<<< HEAD
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
=======
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700"
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
<<<<<<< HEAD
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
=======
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
        </div>
      )}

      {/* Products Table */}
<<<<<<< HEAD
      {!isLoading && products.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
=======
      {!isLoading && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
                    Actions
                  </th>
                </tr>
              </thead>
<<<<<<< HEAD
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${product._id}`} className="flex items-center group">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="relative h-10 w-10">
                            <Image
                              src={product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '' ? product.imageUrl : '/fallback-product.png'}
                              alt={product.name}
                              fill
                              className="rounded-lg object-cover"
                              onError={(e) => { e.currentTarget.src = '/fallback-product.png'; }}
                            />
                          </div>
=======
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${product._id}`} className="flex items-center group">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.imageUrl ? (
                            <div className="relative h-10 w-10">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.quantity <= (product.lowStockThreshold || 10)
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
<<<<<<< HEAD
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'No expiry'}
=======
                      ${product.price?.toFixed(2)}
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/products/edit/${product._id}`}
<<<<<<< HEAD
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
=======
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteProductItem(product)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete product"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
<<<<<<< HEAD
        <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory 
                ? 'No products match your search criteria. Try adjusting your filters.'
                : 'Get started by adding your first product to the inventory.'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Link
                href="/products/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Link>
            )}
          </div>
=======
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium border ${
                  currentPage === page
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                } ${
                  page === 1 ? 'rounded-l-md' : ''
                } ${
                  page === pagination.pages ? 'rounded-r-md' : ''
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteProductItem}
        onClose={() => setDeleteProductItem(null)}
        onConfirm={() => {
          if (deleteProductItem) {
            deleteMutation.mutate(deleteProductItem._id)
            setDeleteProductItem(null)
          }
        }}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteProductItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}