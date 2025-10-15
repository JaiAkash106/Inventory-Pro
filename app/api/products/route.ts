<<<<<<< HEAD
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })
    }

  const deletedProduct = await Product.findByIdAndDelete(id).exec()
    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })
    }

    const data = await request.json()
    const {
      name,
      category,
      quantity,
      price,
      description,
      lowStockThreshold,
      sku,
      imageUrl,
      expiryDate
    } = data

    // Validate required fields
    if (!name || !category || quantity === undefined || price === undefined || !sku) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dateToSave = expiryDate ? new Date(expiryDate) : undefined

    const updateData: Partial<IProduct> = {
      name,
      category,
      quantity: parseInt(quantity.toString()),
      price: parseFloat(price.toString()),
      description,
      lowStockThreshold: parseInt(lowStockThreshold?.toString() || '10'),
      sku,
      imageUrl,
      expiryDate: dateToSave as any
    }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).exec()
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import ProductOrig from '@/lib/models/Product'
const Product = ProductOrig as mongoose.Model<any>
import type { IProduct } from '@/lib/models/Product'
=======
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Product, { IProduct } from '@/lib/models/Product'
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
import { Session } from 'next-auth'
import { FilterQuery } from 'mongoose'
import { authOptions } from '../auth/auth.config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    let query: FilterQuery<IProduct> = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (category) {
      query.category = category
    }

    const products = await Product.find(query)
<<<<<<< HEAD
      .populate('createdBy', 'name email')
=======
      .populate<{ createdBy: { name: string; email: string } }>('createdBy', 'name email')
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
<<<<<<< HEAD
      .exec()
=======
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const data = await request.json()
    const {
      name,
      category,
      quantity,
      price,
      description,
      lowStockThreshold,
      sku,
<<<<<<< HEAD
      imageUrl,
      expiryDate 
=======
      imageUrl
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
    } = data

    // Validate required fields
    if (!name || !category || quantity === undefined || price === undefined || !sku) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
<<<<<<< HEAD
  const existingProduct = await Product.findOne({ sku }).lean().exec()
=======
    const existingProduct = await Product.findOne({ sku }).lean()
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
    if (existingProduct) {
      return NextResponse.json(
        { message: 'SKU already exists' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    const dateToSave = expiryDate ? new Date(expiryDate) : undefined

    const productData: Partial<IProduct> = { // Use Partial<IProduct> or define a strict body type
=======
    // At this point we know session.user.id exists because we checked above
    const productData = {
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
      name,
      category,
      quantity: parseInt(quantity.toString()),
      price: parseFloat(price.toString()),
      description,
      lowStockThreshold: parseInt(lowStockThreshold?.toString() || '10'),
      sku,
      imageUrl,
<<<<<<< HEAD
      createdBy: session.user.id,
      // 🛑 NEW: Include the converted expiryDate
      expiryDate: dateToSave as any // Cast is sometimes needed for Mongoose Date type on creation
    }

  const product = await Product.create(productData)
=======
      createdBy: session.user.id // Session is guaranteed to have user.id here
    }

    const product = await Product.create(productData)
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e

    await product.save()
    await product.populate('createdBy', 'name email')

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}