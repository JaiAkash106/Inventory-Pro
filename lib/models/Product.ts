import mongoose from 'mongoose'

<<<<<<< HEAD
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ""
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ""
  },
  expiryDate: {
    type: Date,
    default: null
=======
export interface IProduct extends mongoose.Document {
  name: string
  category: string
  quantity: number
  price: number
  description: string
  imageUrl?: string
  lowStockThreshold: number
  sku: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative'],
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
<<<<<<< HEAD
    required: false  // Made optional
  }
}, {
  timestamps: true
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
=======
    required: [true, 'Product must be created by a user']
  },
}, {
  timestamps: true,
})

// Index for better search performance
productSchema.index({ name: 'text', category: 'text', description: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ quantity: 1 })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
