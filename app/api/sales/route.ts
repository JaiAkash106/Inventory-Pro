// app/api/sales/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Try different import paths for authOptions
export async function POST(request: NextRequest) {
  try {
    // For now, skip authentication during development
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const saleData = await request.json()

    // Create sale object
    const sale = {
      _id: `sale_${Date.now()}`,
      ...saleData,
      createdAt: new Date().toISOString(),
      createdBy: 'admin' // session.user.email for production
    }

    console.log('📦 Sale processed:', sale)

    // TODO: Save to your database
    // Example for MongoDB:
    // await db.collection('sales').insertOne(sale)

    return NextResponse.json({ 
      success: true, 
      sale,
      message: 'Sale processed successfully'
    })

  } catch (error) {
    console.error('Error processing sale:', error)
    return NextResponse.json(
      { error: 'Failed to process sale' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For development, skip auth
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // TODO: Fetch from your database
    // const sales = await db.collection('sales').find().sort({ createdAt: -1 }).toArray()
    
    // Return empty array for now
    const sales = []

    return NextResponse.json(sales)

  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    )
  }
}