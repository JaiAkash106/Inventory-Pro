'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  User, 
  Phone, 
  Calendar, 
  DollarSign, 
  Package, 
  Eye,
  RefreshCw,
  Plus
} from 'lucide-react'

interface OrderItem {
  productId: string
  name: string
  sku: string
  quantity: number
  price: number
  total: number
}

interface Order {
  _id: string
  orderId: string
  customer: {
    phone: string
    name?: string
    email?: string
  }
  items: OrderItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  paymentMethod: string
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      console.log("🔄 Fetching orders...")
      
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("✅ Orders data:", data)
      setOrders(data.orders || [])
      
    } catch (err: any) {
      console.error("❌ Fetch error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const seedOrders = async () => {
    try {
      setLoading(true)
      console.log("🔄 Seeding orders...")
      
      const response = await fetch('/api/orders/seed', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to seed orders')
      }
      
      await fetchOrders()
    } catch (err: any) {
      console.error("❌ Seed error:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
        <p className="text-gray-600 mb-2">{error}</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <button
            onClick={seedOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={16} />
            Add Sample Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">View all customer orders</p>
        </div>
        <div className="flex gap-4">
          {orders.length === 0 && !loading && (
            <button
              onClick={seedOrders}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={16} />
              Add Sample Orders
            </button>
          )}
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <FileText className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-3xl font-bold">
                {orders.filter(order => order.status === 'completed').length}
              </p>
            </div>
            <Package className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={20} />
            Recent Orders ({orders.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding sample orders</p>
            <button
              onClick={seedOrders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus size={16} />
              Add Sample Orders
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-600">{order.orderId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-medium">
                        <User size={14} />
                        {order.customer.name || 'No Name'}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details - {selectedOrder.orderId}</h2>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="text-2xl hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User size={20} />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                  <p><strong>Name:</strong> {selectedOrder.customer.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package size={20} />
                  Order Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm">Quantity: {item.quantity} × ${item.price} = <strong>${item.total}</strong></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({selectedOrder.taxRate}%):</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
                <p><strong>Method:</strong> <span className="capitalize">{selectedOrder.paymentMethod}</span></p>
                <p><strong>Status:</strong> <span className="capitalize">{selectedOrder.status}</span></p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}