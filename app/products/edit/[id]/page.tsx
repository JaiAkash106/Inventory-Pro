'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload, Wand2, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

// Mock product data - replace with actual API call
const fetchProduct = async (id: string) => {
    const products = [
        {
            id: '1',
            name: 'Wireless Headphones',
            category: 'Electronics',
            quantity: 25,
            price: 99.99,
            description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
            lowStockThreshold: 10,
            sku: 'WH-001',
            imageUrl: null,
        },
        {
            id: '2',
            name: 'Coffee Mug',
            category: 'Kitchen',
            quantity: 8,
            price: 12.99,
            description: 'Ceramic coffee mug with ergonomic handle. Dishwasher safe and perfect for hot beverages.',
            lowStockThreshold: 5,
            sku: 'CM-002',
            imageUrl: null,
        },
    ]
    return products.find(p => p.id === id) || null
}

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [isLoading, setIsLoading] = useState(false)
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
    const [product, setProduct] = useState(null)
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

    const categories = ['Electronics', 'Kitchen', 'Stationery', 'Clothing', 'Books']

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`)
                if (response.ok) {
                    const productData = await response.json()
                    setProduct(productData)
                    setFormData({
                        name: productData.name,
                        category: productData.category,
                        quantity: productData.quantity.toString(),
                        price: productData.price.toString(),
                        description: productData.description || '',
                        lowStockThreshold: productData.lowStockThreshold.toString(),
                        sku: productData.sku,
                        imageUrl: productData.imageUrl || '',
                    })
                } else {
                    toast.error('Product not found')
                    router.push('/products')
                }
            } catch (error) {
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
        setIsLoading(true)

        try {
            const response = await fetch(`/api/products/${productId}`, {
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
                }),
            })

            if (response.ok) {
                toast.success('Product updated successfully!')
                router.push('/products')
            } else {
                const error = await response.json()
                toast.error(error.message || 'Failed to update product')
            }
        } catch (error) {
            toast.error('Failed to update product')
        } finally {
            setIsLoading(false)
        }
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Information */}
                        <div className="lg:col-span-2">
                            <div className="card">
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={formData.lowStockThreshold}
                                                onChange={handleChange}
                                            />
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
                                                className="btn-secondary text-sm flex items-center"
                                            >
                                                <Wand2 className="w-4 h-4 mr-1" />
                                                {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                                            </button>
                                        </div>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="lg:col-span-1">
                            <div className="card">
                                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Image</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload product image</p>
                                </div>
                                <div className="p-6">
                                    {formData.imageUrl ? (
                                        <div className="mb-4">
                                            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <div className="flex items-center justify-center h-full">
                                                    <span className="text-gray-500 dark:text-gray-400">Image Preview</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
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
                            className="btn-primary flex-1 flex justify-center items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Updating...' : 'Update Product'}
                        </button>
                        <Link href="/products" className="btn-secondary flex-1 flex justify-center items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}