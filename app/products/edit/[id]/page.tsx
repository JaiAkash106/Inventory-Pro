'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload, Wand2, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [isLoading, setIsLoading] = useState(false)
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        lowStockThreshold: '10',
        sku: '',
        imageUrl: '',
        expiryDate: '',
    })

    const categories = ['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books', 'Food', 'Home & Garden', 'Health & Beauty', 'Sports', 'Other']

    useEffect(() => {
        const loadProduct = async () => {
            try {
                // Fetch all products and find the one with matching ID
                const response = await fetch('/api/products')
                if (response.ok) {
                    const data = await response.json()
                    // API returns either an array or an object { products, pagination }
                    const products = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
                    const productData = products.find((p: any) => p._id === productId)
                    if (productData) {
                        setProduct(productData)
                        setFormData({
                            name: productData.name || '',
                            category: productData.category || '',
                            quantity: productData.quantity?.toString() || '',
                            price: productData.price?.toString() || '',
                            description: productData.description || '',
                            lowStockThreshold: productData.lowStockThreshold?.toString() || '10',
                            sku: productData.sku || '',
                            imageUrl: productData.imageUrl || '',
                            expiryDate: productData.expiryDate ? new Date(productData.expiryDate).toISOString().split('T')[0] : '',
                        })
                    } else {
                        toast.error('Product not found')
                        router.push('/products')
                    }
                } else {
                    toast.error('Failed to load products')
                    router.push('/products')
                }
            } catch (error) {
                console.error('Error loading product:', error)
                toast.error('Failed to load product')
                router.push('/products')
            }
        }

        if (productId) {
            loadProduct()
        }
    }, [productId, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const generateDescription = async () => {
        if (!formData.name || !formData.category) {
            toast.error('Please enter product name and category first')
            return
        }

        setIsGeneratingDescription(true)
        try {
            // Mock AI description generation
            await new Promise(resolve => setTimeout(resolve, 2000))
            const mockDescription = `Updated high-quality ${formData.name.toLowerCase()} in the ${formData.category.toLowerCase()} category. Features excellent build quality and modern design. Perfect for everyday use with reliable performance and durability.`

            setFormData(prev => ({ ...prev, description: mockDescription }))
            toast.success('Description generated successfully!')
        } catch (error) {
            toast.error('Failed to generate description')
        } finally {
            setIsGeneratingDescription(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate required fields
        if (!formData.name || !formData.category || !formData.quantity || !formData.price || !formData.sku) {
            toast.error('Please fill in all required fields')
            return
        }

        // Validate expiry date
        if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
            toast.error('Expiry date cannot be in the past')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`/api/products?id=${productId}`, {  // ✅ Fixed URL with query parameter
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    quantity: parseInt(formData.quantity),
                    price: parseFloat(formData.price),
                    description: formData.description,
                    lowStockThreshold: parseInt(formData.lowStockThreshold),
                    sku: formData.sku,
                    imageUrl: formData.imageUrl,
                    expiryDate: formData.expiryDate || null,
                }),
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success('Product updated successfully!')
                router.push('/products')
                router.refresh()
            } else {
                toast.error(responseData.error || 'Failed to update product')
            }
        } catch (error) {
            console.error('Update product error:', error)
            toast.error('Failed to update product')
        } finally {
            setIsLoading(false)
        }
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/products"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
                    <p className="text-gray-600 dark:text-gray-400">Update product information</p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-6xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Information</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update product details</p>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Product Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                name="category"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.category}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Price *
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.price}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                SKU *
                                            </label>
                                            <input
                                                type="text"
                                                name="sku"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.sku}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Low Stock Threshold
                                            </label>
                                            <input
                                                type="number"
                                                name="lowStockThreshold"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.lowStockThreshold}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Expiry Date Field */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave blank if product doesn't expire
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description
                                            </label>
                                            <button
                                                type="button"
                                                onClick={generateDescription}
                                                disabled={isGeneratingDescription}
                                                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center"
                                            >
                                                <Wand2 className="w-4 h-4 mr-1" />
                                                {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                                            </button>
                                        </div>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload & Stats */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Image</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload product image</p>
                                </div>
                                <div className="p-6">
                                    {formData.imageUrl ? (
                                        <div className="mb-4">
                                            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <img 
                                                    src={formData.imageUrl} 
                                                    alt="Product preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-6">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    )}

                                    {/* Image URL Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    {/* Product Stats */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Current Stock</span>
                                            <span className={`font-semibold ${parseInt(formData.quantity) < parseInt(formData.lowStockThreshold) ? 'text-red-600' : 'text-green-600'}`}>
                                                {formData.quantity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${(parseFloat(formData.price || '0') * parseInt(formData.quantity || '0')).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                        <Link 
                            href="/products" 
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex justify-center items-center"
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