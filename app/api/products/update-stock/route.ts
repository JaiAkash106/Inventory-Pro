import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Product from "@/lib/models/Product"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    const body = await req.json()
    const { updates } = body

    console.log("🔄 Received stock updates request:", updates)

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates data" }, 
        { status: 400 }
      )
    }

    // Process each stock update
    const updateResults = []
    
    for (const update of updates) {
      const { productId, quantitySold, currentQuantity } = update
      
      // Find the product
      const product = await Product.findById(productId)
      
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` }, 
          { status: 404 }
        )
      }

      // Calculate new quantity
      const newQuantity = product.quantity - quantitySold
      
      if (newQuantity < 0) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${quantitySold}` }, 
          { status: 400 }
        )
      }

      // Update the product stock in database
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { quantity: newQuantity },
        { new: true, runValidators: true }
      )

      updateResults.push({
        productId,
        productName: product.name,
        oldQuantity: product.quantity,
        newQuantity: updatedProduct.quantity,
        quantitySold
      })

      console.log(`✅ Stock updated: ${product.name} ${product.quantity} -> ${updatedProduct.quantity}`)
    }

    console.log("✅ All stock updates completed successfully")
    
    return NextResponse.json({
      success: true,
      message: "Stock quantities updated successfully",
      updates: updateResults
    })

  } catch (error: any) {
    console.error("❌ Error updating stock quantities:", error)
    
    return NextResponse.json(
      { error: "Failed to update stock quantities: " + error.message }, 
      { status: 500 }
    )
  }
}