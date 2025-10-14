import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/lib/models/orders"

export async function POST() {
  try {
    console.log("🔄 Seeding orders...")
    
    await dbConnect()

    // Clear existing orders
    await Order.deleteMany({})
    console.log("✅ Cleared existing orders")

    // Create sample orders
    const sampleOrders = [
      {
        customer: {
          phone: "+1234567890",
          name: "John Doe",
          email: "john@example.com"
        },
        items: [
          {
            productId: "507f1f77bcf86cd799439011",
            name: "Wireless Mouse",
            sku: "WM-001",
            quantity: 2,
            price: 25.99,
            total: 51.98
          }
        ],
        subtotal: 51.98,
        taxRate: 10,
        taxAmount: 5.20,
        discount: 0,
        total: 57.18,
        paymentMethod: "card",
        status: "completed"
      }
    ]

    const createdOrders = await Order.insertMany(sampleOrders)
    console.log(`✅ Created ${createdOrders.length} sample orders`)
    
    return NextResponse.json({
      message: "Sample orders created successfully",
      orders: createdOrders,
      count: createdOrders.length
    })
  } catch (error) {
    console.error("❌ Error seeding orders:", error)
    return NextResponse.json(
      { error: "Failed to seed orders" }, 
      { status: 500 }
    )
  }
}