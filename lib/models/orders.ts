import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
})

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    phone: {
      type: String,
      required: true
    },
    name: String,
    email: String
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'upi', 'bank transfer']
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'cancelled', 'refunded', 'pending'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
})

// Generate order ID before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date()
    const timestamp = date.getTime().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    this.orderId = `ORD-${timestamp}-${random}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)