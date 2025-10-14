import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/lib/models/orders"

// GET all orders
export async function GET() {
  try {
    console.log("🔄 GET /api/orders - Fetching orders...")
    
    await dbConnect()
    console.log("✅ Database connected for GET")
    
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    console.log(`✅ Found ${orders.length} orders`)

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    return NextResponse.json({
      orders,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        avgOrderValue
      }
    })
  } catch (error: any) {
    console.error("❌ Error in GET /api/orders:", error)
    return NextResponse.json({
      orders: [],
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0
      },
      error: error.message
    })
  }
}

// POST - Create new order
export async function POST(req: Request) {
  try {
    console.log("🔄 POST /api/orders - Creating order...")
    
    await dbConnect()
    console.log("✅ Database connected for POST")
    
    const body = await req.json()
    console.log("📦 Order data:", body)
    
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const orderId = `ORD-${timestamp}-${random}`
    
    const order = await Order.create({
      ...body,
      orderId
    })
    
    console.log("✅ Order created successfully:", orderId)
    
    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error in POST /api/orders:", error)
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}