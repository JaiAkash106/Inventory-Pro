import mongoose from 'mongoose'

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
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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