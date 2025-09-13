import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    // Get total products count
    const totalProducts = await Product.countDocuments()
    
    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    })
    
    // Calculate total inventory value
    const valueAggregation = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      }
    ])
    
    const totalValue = valueAggregation[0]?.totalValue || 0
    
    // Get recent products (last 5)
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category quantity price createdAt')
    
    // Get category distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Calculate monthly growth (mock data for now)
    const monthlyGrowth = 8.5

    return NextResponse.json({
      totalProducts,
      lowStockProducts,
      totalValue,
      monthlyGrowth,
      recentProducts,
      categoryStats
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}