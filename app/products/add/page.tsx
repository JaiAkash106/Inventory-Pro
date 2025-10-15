"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
    lowStockThreshold: "10",
    sku: "",
    imageUrl: "",
    expiryDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate SKU when category is selected and SKU is empty
    if (name === 'category' && !formData.sku) {
      const random = Math.random().toString(36).substring(2, 8).toUpperCase()
      const categoryPrefix = value ? getCategoryPrefix(value) : 'PR'
      setFormData(prev => ({
        ...prev,
        category: value,
        sku: `${categoryPrefix}-${random}`
      }))
    }
  }

  const getCategoryPrefix = (category: string) => {
    const prefixes: { [key: string]: string } = {
      'Electronics': 'EL',
      'Clothing': 'CL',
      'Food': 'FD',
      'Books': 'BK',
      'Home & Garden': 'HG',
      'Health & Beauty': 'HB',
      'Sports': 'SP',
      'Other': 'OT'
    }
    return prefixes[category] || 'PR'
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create a temporary URL for the image preview (optional)
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }))
    }
  }

  const generateSKU = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const categoryPrefix = formData.category ? getCategoryPrefix(formData.category) : 'PR'
    setFormData(prev => ({
      ...prev,
      sku: `${categoryPrefix}-${random}`
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields
    if (!formData.name || !formData.category || !formData.quantity || !formData.price || !formData.sku) {
      alert("Please fill in all required fields (Name, Category, Quantity, Price, and SKU)")
      return
    }

    // Validate expiry date
    if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
      alert("Expiry date cannot be in the past")
      return
    }

    // Validate quantity and price are positive numbers
    if (parseInt(formData.quantity) < 0) {
      alert("Quantity cannot be negative")
      return
    }

    if (parseFloat(formData.price) < 0) {
      alert("Price cannot be negative")
      return
    }

    setLoading(true)

    try {
      console.log("Sending product data:", {
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10
      })

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          lowStockThreshold: parseInt(formData.lowStockThreshold) || 10
        }),
      })

      const responseData = await res.json()
      console.log("API Response:", responseData)

      if (res.ok) {
        alert("Product added successfully!")
        router.push("/products")
        router.refresh() // Refresh the products page
      } else {
        alert(`Failed to add product: ${responseData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Add product error:", error)
      alert("Network error - check console for details")
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      description: "",
      lowStockThreshold: "10",
      sku: "",
      imageUrl: "",
      expiryDate: "",
    })
    setImageFile(null)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <h2 className="text-xl font-semibold text-gray-700 mt-2">Add New Product</h2>
        <p className="text-gray-500">Create a new product in your inventory</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-500">Essential details about your product</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your product features, benefits, and specifications..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Pricing & Inventory */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
                <p className="text-sm text-gray-500">Set pricing and manage stock levels</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    min="1"
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when stock falls below this number
                  </p>
                </div>
              </div>

              {/* EXPIRY DATE FIELD */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if product doesn't expire
                </p>
              </div>

              {/* SKU Field with Generate Button */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Generate SKU
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU or click Generate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Stock Keeping Unit for inventory tracking
                </p>
              </div>
            </div>

            {/* Product Image */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Image</h3>
                <p className="text-sm text-gray-500">Upload a high-quality image of your product</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.imageUrl ? (
                  <div className="mb-4">
                    <img 
                      src={formData.imageUrl} 
                      alt="Product preview" 
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-400">📷</span>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mb-2">
                  {formData.imageUrl ? "Image Preview" : "No Image"}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Click to upload or drag and drop<br />
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                >
                  Choose File
                </label>
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">Selected: {imageFile.name}</p>
                )}
                
                {/* Fallback URL input */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Or enter image URL:</p>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => router.push("/products")}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={clearForm}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Clear
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}