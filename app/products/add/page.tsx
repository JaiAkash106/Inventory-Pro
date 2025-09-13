'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Wand2, Package, Tag, DollarSign, Hash, FileText, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// Remove the duplicate type declaration as it's already in global.d.ts


async function createProduct(data: any) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create product')
  }

  return response.json()
}

export default function AddProductPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
    lowStockThreshold: '10',
    sku: '',
    imageUrl: '',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const categories = ['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books', 'Sports', 'Beauty', 'Home & Garden']

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Product created successfully')
      router.push('/products')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    if (e.target.type === 'number') {
      value = value.replace(/^0+/, '') || '0'
    }
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSKU = () => {
    if (!formData.category) {
      toast.error('Please select a category first')
      return
    }
    const prefix = formData.category.substring(0, 2).toUpperCase()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const timestamp = Date.now().toString().slice(-3)
    setFormData(prev => ({ ...prev, sku: `${prefix}-${random}${timestamp}` }))
    toast.success('SKU generated!')
  }

  const generateDescription = async () => {
    if (!formData.name || !formData.category) {
      toast.error('Please enter product name and category first')
      return
    }

    setIsGeneratingDescription(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const descriptions = [
      `Premium ${formData.name.toLowerCase()} designed for the modern ${formData.category.toLowerCase()} enthusiast. Features exceptional build quality, innovative design, and outstanding performance. Perfect for both professional and personal use with long-lasting durability.`,
      `High-quality ${formData.name.toLowerCase()} in the ${formData.category.toLowerCase()} category. Engineered with precision and attention to detail. Offers excellent value with reliable performance and contemporary styling that meets today's demanding standards.`,
      `Professional-grade ${formData.name.toLowerCase()} that combines functionality with style. Built to exceed expectations in the ${formData.category.toLowerCase()} market. Features cutting-edge technology and premium materials for superior user experience.`
    ]
    
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
    
    setFormData(prev => ({
      ...prev,
      description: randomDescription
    }))
    
    setIsGeneratingDescription(false)
    toast.success('Description generated!')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a product')
      return
    }

    // Validate form fields
    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    if (parseInt(formData.quantity) < 0) {
      toast.error('Quantity cannot be negative')
      return
    }
    
    const productData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      createdBy: session.user.id,
    }
    createProductMutation.mutate(productData)
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData(prev => ({ ...prev, imageUrl: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/products"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new product in your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Essential details about your product</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>Product Name</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter product name"
                    aria-required="true"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>Category</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>Description</span>
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={generateDescription}
                      disabled={isGeneratingDescription}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wand2 className={`w-3 h-3 mr-1.5 ${isGeneratingDescription ? 'animate-spin text-blue-500' : ''}`} />
                      {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                    </button>
                  </div>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                    placeholder="Describe your product features, benefits, and specifications..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Inventory</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set pricing and manage stock levels</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <Hash className="w-4 h-4" />
                      <span>Quantity</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Price</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Low Stock Alert</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    required
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alert when stock falls below this number</p>
                </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center space-x-1">
                      <Hash className="w-4 h-4" />
                      <span>SKU</span>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="sku"
                      required
                      value={formData.sku}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
                      placeholder="Enter SKU"
                    />
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="btn-secondary px-3 py-3"
                      title="Generate SKU"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock Keeping Unit for inventory tracking</p>
                </div>
              </div>
           
          </div>

          {/* Product Image */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Image</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload a high-quality image of your product</p>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-6">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">No image</p>
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <label className="relative block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-700 cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900 flex-1"
            >
              {createProductMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Product...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </button>
            <Link
              href="/products"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}