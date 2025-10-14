<<<<<<< HEAD
// app/products/page.tsx
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    
    const products = await res.json()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  console.log('Products to display:', products) // Check terminal for this log
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${product.price}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
=======
'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Package, Tag, DollarSign, Hash, AlertTriangle, Clock, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  category: string
  quantity: number
  price: number
  description: string
  lowStockThreshold: number
  sku: string
  imageUrl?: string
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }
  return response.json()
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

  const handleEdit = () => {
    router.push(`/products/edit/${productId}`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Product deleted successfully')
      router.push('/products')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Product not found</h2>
            <p className="mt-2 text-g ray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isLowStock = product.quantity <= product.lowStockThreshold
  const isOutOfStock = product.quantity === 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg border mb-8">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center mt-1">
                    <Tag className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="col-span-2 space-y-8">
            {/* Product Details */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
              </div>
              <div className="p-6">
                {product.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-64 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Stock History */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Stock Movement</h2>
              </div>
              <div className="p-6">
                {/* TODO: Add stock movement history */}
                <p className="text-gray-600">Stock movement history will be shown here</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-8">
            {/* Stock Info */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Stock Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Current Stock</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      isOutOfStock ? 'bg-red-100 text-red-800' :
                      isLowStock ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.quantity} units
                    </span>
                  </div>
                  {(isLowStock || isOutOfStock) && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {isOutOfStock ? 'Out of stock!' : 'Low stock alert!'}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Low Stock Threshold</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{product.lowStockThreshold} units</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Unit Price</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">${product.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Hash className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">SKU</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{product.sku}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Created By</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.createdBy.name}</p>
                  <p className="text-sm text-gray-600">{product.createdBy.email}</p>
                </div>

                <div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Created On</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Last Updated</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(product.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
