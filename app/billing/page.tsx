'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  User, 
  Phone, 
  Mail,
  Calculator,
  FileText,
  AlertTriangle,
  Package,
  RefreshCw
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  category: string
  quantity: number
  price: number
  cost: number
  sku: string
  lowStockThreshold: number
}

interface CartItem {
  product: Product
  quantity: number
  total: number
}

interface Customer {
  phone: string
  name?: string
  email?: string
}

interface StockUpdate {
  productId: string
  quantitySold: number
  currentQuantity: number
}

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer>({ phone: '' })
  const [loading, setLoading] = useState(true)
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isGeneratingBill, setIsGeneratingBill] = useState(false)
  const [isUpdatingStock, setIsUpdatingStock] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        console.log('📦 Products loaded:', data.length)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to load products. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert('❌ Product is out of stock!')
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        if (newQuantity > product.quantity) {
          alert(`⚠️ Only ${product.quantity} units available in stock!`)
          return prevCart
        }
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity, total: newQuantity * product.price }
            : item
        )
      } else {
        if (product.quantity < 1) {
          alert('❌ Product is out of stock!')
          return prevCart
        }
        return [...prevCart, { product, quantity: 1, total: product.price }]
      }
    })
    
    setSearchTerm('')
    if (searchRef.current) searchRef.current.focus()
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    const product = products.find(p => p._id === productId)
    if (product && newQuantity > product.quantity) {
      alert(`⚠️ Only ${product.quantity} units available in stock!`)
      return
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity: newQuantity, total: newQuantity * item.product.price }
        }
        return item
      })
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax - discount

  // ✅ SIMPLIFIED STOCK UPDATE FUNCTION
  const updateStockQuantities = async (): Promise<boolean> => {
    try {
      setIsUpdatingStock(true)
      console.log('🔄 Starting permanent stock update...')
      
      // Prepare stock updates
      const stockUpdates = cart.map(item => ({
        productId: item.product._id,
        quantitySold: item.quantity,
        currentQuantity: item.product.quantity
      }))

      console.log('📤 Sending stock updates:', stockUpdates)

      // ✅ Update database
      const response = await fetch('/api/products/update-stock', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          updates: stockUpdates
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Stock update failed:', errorData)
        alert(`❌ Stock update failed: ${errorData.error || 'Unknown error'}`)
        return false
      }

      const result = await response.json()
      console.log('✅ Stock update successful:', result)

      // Update local state
      const updatedProducts = [...products]
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p._id === cartItem.product._id)
        if (productIndex !== -1) {
          updatedProducts[productIndex].quantity -= cartItem.quantity
        }
      })
      setProducts(updatedProducts)
      
      return true
      
    } catch (error: any) {
      console.error('❌ Stock update error:', error)
      alert('❌ Failed to update stock quantities. Please try again.')
      return false
    } finally {
      setIsUpdatingStock(false)
    }
  }

  // ✅ SAVE ORDER TO DATABASE FUNCTION (MOVED OUTSIDE generateBill)
  const saveOrderToDatabase = async (): Promise<boolean> => {
    try {
      const orderData = {
        customer,
        items: cart.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          price: item.product.price,
          total: item.total
        })),
        subtotal,
        taxRate,
        taxAmount: tax,
        discount,
        total,
        paymentMethod,
        status: 'completed' as const
      }

      console.log('💾 Saving order to database:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Failed to save order:', errorData)
        return false
      }

      const savedOrder = await response.json()
      console.log('✅ Order saved successfully:', savedOrder.orderId)
      return true

    } catch (error) {
      console.error('❌ Error saving order:', error)
      return false
    }
  }

  // ✅ BILL GENERATION WITH PERMANENT STOCK UPDATES
  const generateBill = async () => {
    if (cart.length === 0) {
      alert('❌ Please add items to the cart!')
      return
    }

    if (!customer.phone) {
      alert('❌ Please enter customer phone number!')
      return
    }

    setIsGeneratingBill(true)

    try {
      console.log('🧾 Starting bill generation process...')

      // ✅ STEP 1: Update stock quantities PERMANENTLY in database
      const stockUpdated = await updateStockQuantities()
      
      if (!stockUpdated) {
        alert('❌ Stock update failed. Bill not generated.')
        setIsGeneratingBill(false)
        return
      }

      console.log('✅ Stock updated successfully')

      // ✅ STEP 2: Save order to database
      const orderSaved = await saveOrderToDatabase()
      
      if (!orderSaved) {
        alert('⚠️ Stock updated but failed to save order details. Bill will still be generated.')
        // Continue with bill generation even if order save fails
      }

      console.log('✅ Order saved, generating bill...')

      // ✅ STEP 3: Generate bill/PDF
      const orderId = `ORD-${Date.now().toString().slice(-6)}`
      const currentDate = new Date().toLocaleString()

      const billContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
              background: white;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 3px double #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #2c5aa0;
              margin-bottom: 5px;
            }
            .company-tagline {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
            }
            .bill-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .bill-section {
              margin-bottom: 10px;
            }
            .bill-label {
              font-weight: bold;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #f8f9fa;
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
              font-weight: bold;
            }
            td {
              border: 1px solid #ddd;
              padding: 12px;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .totals {
              margin-top: 30px;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 0 20px;
            }
            .grand-total {
              font-size: 18px;
              font-weight: bold;
              border-top: 1px solid #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
            .thank-you {
              text-align: center;
              margin: 30px 0;
              font-style: italic;
              color: #2c5aa0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-container { border: none; padding: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-name">INVENTORY PRO</div>
              <div class="company-tagline">Professional Inventory Management System</div>
              <div class="invoice-title">TAX INVOICE</div>
            </div>

            <div class="bill-details">
              <div>
                <div class="bill-section">
                  <span class="bill-label">Order ID:</span> ${orderId}
                </div>
                <div class="bill-section">
                  <span class="bill-label">Date:</span> ${currentDate}
                </div>
                <div class="bill-section">
                  <span class="bill-label">Payment Method:</span> ${paymentMethod.toUpperCase()}
                </div>
              </div>
              <div>
                <div class="bill-section">
                  <span class="bill-label">Customer Phone:</span> ${customer.phone}
                </div>
                ${customer.name ? `<div class="bill-section"><span class="bill-label">Customer Name:</span> ${customer.name}</div>` : ''}
                ${customer.email ? `<div class="bill-section"><span class="bill-label">Customer Email:</span> ${customer.email}</div>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map((item, index) => `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>${item.product.name}</td>
                    <td>${item.product.sku}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">$${item.product.price.toFixed(2)}</td>
                    <td class="text-right">$${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              ${tax > 0 ? `
              <div class="total-row">
                <span>Tax (${taxRate}%):</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              ` : ''}
              ${discount > 0 ? `
              <div class="total-row">
                <span>Discount:</span>
                <span>-$${discount.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row grand-total">
                <span>GRAND TOTAL:</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>

            <div class="thank-you">
              Thank you for your business! Stock quantities have been permanently updated.
            </div>

            <div class="footer">
              <p>For any queries, please contact: support@inventorypro.com | Phone: +1-555-INVENTORY</p>
              <p>This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Open print window
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(billContent)
        printWindow.document.close()
        
        printWindow.onload = () => {
          printWindow.focus()
          printWindow.print()
          
          // ✅ STEP 4: Clear cart and show success message
          setCart([])
          setCustomer({ phone: '' })
          setDiscount(0)
          setTaxRate(0)
          
          alert(`✅ Bill ${orderId} generated successfully!\n\nStock quantities have been permanently updated in the database.`)
          
          // Refresh products to ensure we have latest data
          fetchProducts()
        }
      }
      
    } catch (error: any) {
      console.error('❌ Bill generation error:', error)
      alert('❌ Failed to generate bill. Please try again.')
    } finally {
      setIsGeneratingBill(false)
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const lowStockProducts = products.filter(product => 
    product.quantity <= product.lowStockThreshold
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & POS</h1>
          <p className="text-gray-600">Process customer purchases and update stock permanently</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Products
          </button>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Customer Info & Product Search */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Enter customer phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customer.name || ''}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Customer name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customer.email || ''}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="Customer email (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Search</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name, SKU, or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found</p>
              ) : (
                filteredProducts.map(product => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                    className={`w-full text-left p-3 border rounded-lg transition-colors flex justify-between items-center ${
                      product.quantity <= 0
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : product.quantity <= product.lowStockThreshold
                        ? 'border-amber-200 bg-amber-50 hover:border-amber-300'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{product.name}</p>
                        {product.quantity <= product.lowStockThreshold && (
                          <AlertTriangle className="text-amber-500" size={14} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {product.category} • {product.sku}
                      </p>
                      <p className={`text-sm ${
                        product.quantity <= product.lowStockThreshold 
                          ? 'text-amber-600 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        Stock: {product.quantity} • $${product.price}
                        {product.quantity <= product.lowStockThreshold && ' (Low Stock)'}
                      </p>
                    </div>
                    <Plus size={16} className="text-blue-600" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Low Stock Products ({lowStockProducts.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {lowStockProducts.map(product => (
                  <div key={product._id} className="p-3 bg-amber-100 rounded-lg border border-amber-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-amber-900">{product.name}</p>
                        <p className="text-sm text-amber-700">
                          Current: {product.quantity} • Threshold: {product.lowStockThreshold}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Need immediate restock!
                        </p>
                      </div>
                      <AlertTriangle className="text-amber-500 mt-1" size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Cart & Checkout */}
        <div className="xl:col-span-2 space-y-6">
          {/* Shopping Cart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              Shopping Cart ({cart.length} items)
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto text-gray-400" size={48} />
                <p className="text-gray-500 mt-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add products from the search panel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        {item.product.quantity - item.quantity <= item.product.lowStockThreshold && (
                          <AlertTriangle className="text-amber-500" size={14} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        SKU: {item.product.sku} • $${item.product.price} each
                      </p>
                      <p className={`text-xs ${
                        item.product.quantity - item.quantity <= item.product.lowStockThreshold
                          ? 'text-amber-600 font-medium'
                          : 'text-gray-500'
                      }`}>
                        Stock after sale: {item.product.quantity - item.quantity}
                        {item.product.quantity - item.quantity <= item.product.lowStockThreshold && ' (Will be low stock)'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center bg-transparent border-none focus:outline-none"
                          min="1"
                          max={item.product.quantity}
                        />
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <p className="font-semibold w-20 text-right">$${item.total.toFixed(2)}</p>
                      
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator size={20} />
                Checkout
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (${taxRate}%):</span>
                    <span>$${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-$${discount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max={subtotal}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['cash', 'card', 'upi', 'bank transfer'].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateBill}
                  disabled={!customer.phone || isGeneratingBill || isUpdatingStock}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                >
                  {(isGeneratingBill || isUpdatingStock) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isUpdatingStock ? 'Updating Stock...' : 'Generating Bill...'}
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Generate Bill & Update Stock - $${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  ✅ Stock quantities will be permanently updated in the database
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}