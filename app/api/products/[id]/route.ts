import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const product = await Product.findById(params.id).populate('createdBy', 'name email')
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
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

    // Check if product exists
    const existingProduct = await Product.findById(params.id)
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    // Check if SKU is being changed and if it already exists
    if (sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ sku, _id: { $ne: params.id } })
      if (skuExists) {
        return NextResponse.json(
          { message: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        category,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        description,
        lowStockThreshold: parseInt(lowStockThreshold) || 10,
        sku,
        imageUrl
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}