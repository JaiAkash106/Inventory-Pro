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
    
    // Get out of stock products
    const outOfStockProducts = await Product.countDocuments({ quantity: 0 })
    
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
    
    // Get category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { count: -1 } }
    ])

    // Get top category
    const topCategory = categoryDistribution[0]?._id || 'Electronics'

    // Get monthly trends (last 3 months)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    
    const monthlyTrends = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Get recent activity (last 10 updated products)
    const recentActivity = await Product.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('name quantity price updatedAt')

    // Calculate monthly growth (mock calculation)
    const monthlyGrowth = 8.5

    const reportData = {
      summary: {
        totalProducts,
        totalValue,
        lowStockItems: lowStockProducts,
        outOfStock: outOfStockProducts,
        topCategory,
        monthlyGrowth
      },
      categoryDistribution,
      monthlyTrends,
      recentActivity
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Reports fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}