import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Product, { IProduct } from '@/lib/models/Product'
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
      .populate<{ createdBy: { name: string; email: string } }>('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

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
      imageUrl
    } = data

    // Validate required fields
    if (!name || !category || quantity === undefined || price === undefined || !sku) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku }).lean()
    if (existingProduct) {
      return NextResponse.json(
        { message: 'SKU already exists' },
        { status: 400 }
      )
    }

    // At this point we know session.user.id exists because we checked above
    const productData = {
      name,
      category,
      quantity: parseInt(quantity.toString()),
      price: parseFloat(price.toString()),
      description,
      lowStockThreshold: parseInt(lowStockThreshold?.toString() || '10'),
      sku,
      imageUrl,
      createdBy: session.user.id // Session is guaranteed to have user.id here
    }

    const product = await Product.create(productData)

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