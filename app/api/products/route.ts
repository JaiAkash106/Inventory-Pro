<<<<<<< HEAD
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import mongoose from "mongoose"

// GET all products
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    console.log("Fetching products from database...")
    const products = await Product.find({}).sort({ createdAt: -1 })
    console.log(`Found ${products.length} products`)
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
=======
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
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
      { status: 500 }
    )
  }
}

<<<<<<< HEAD
// POST - Create new product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    const body = await req.json()
    
    // Validate required fields
    if (!body.name || !body.category || !body.quantity || !body.price || !body.sku) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
=======
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
      imageUrl,
      expiryDate 
    } = data

    // Validate required fields
    if (!name || !category || quantity === undefined || price === undefined || !sku) {
      return NextResponse.json(
        { message: 'Missing required fields' },
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
        { status: 400 }
      )
    }

    // Check if SKU already exists
<<<<<<< HEAD
    const existingProduct = await Product.findOne({ sku: body.sku })
    if (existingProduct) {
      return NextResponse.json(
        { error: "SKU already exists" }, 
=======
    const existingProduct = await Product.findOne({ sku }).lean()
    if (existingProduct) {
      return NextResponse.json(
        { message: 'SKU already exists' },
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
        { status: 400 }
      )
    }

<<<<<<< HEAD
    const product = await Product.create({
      ...body,
      quantity: parseInt(body.quantity),
      price: parseFloat(body.price),
      lowStockThreshold: parseInt(body.lowStockThreshold) || 10,
      createdBy: session.user?.id ? new mongoose.Types.ObjectId(session.user.id) : undefined
    })
    
    console.log("Product created successfully:", product.name)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "SKU already exists" }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create product" }, 
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const body = await req.json()
    
    // Check if SKU is being changed and if it already exists
    if (body.sku) {
      const existingProduct = await Product.findOne({ 
        sku: body.sku, 
        _id: { $ne: id } 
      })
      if (existingProduct) {
        return NextResponse.json(
          { error: "SKU already exists" }, 
          { status: 400 }
        )
      }
    }

    const product = await Product.findByIdAndUpdate(
      id, 
      {
        ...body,
        quantity: body.quantity ? parseInt(body.quantity) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        lowStockThreshold: body.lowStockThreshold ? parseInt(body.lowStockThreshold) : undefined
      },
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product updated successfully:", product.name)
    
    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error updating product:", error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "SKU already exists" }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update product" }, 
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    console.log("Deleting product ID:", id)
    
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await Product.findByIdAndDelete(id)
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product deleted successfully:", product.name)
    
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" }, 
=======
    const dateToSave = expiryDate ? new Date(expiryDate) : undefined

    const productData: Partial<IProduct> = { // Use Partial<IProduct> or define a strict body type
      name,
      category,
      quantity: parseInt(quantity.toString()),
      price: parseFloat(price.toString()),
      description,
      lowStockThreshold: parseInt(lowStockThreshold?.toString() || '10'),
      sku,
      imageUrl,
      createdBy: session.user.id,
      // 🛑 NEW: Include the converted expiryDate
      expiryDate: dateToSave as any // Cast is sometimes needed for Mongoose Date type on creation
    }

    const product = await Product.create(productData)

    await product.save()
    await product.populate('createdBy', 'name email')

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
      { status: 500 }
    )
  }
}