import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
<<<<<<< HEAD
<<<<<<< HEAD
=======
// Note: Removed the unused 'authOptions' import, assuming getServerSession() works without it here.
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
=======
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
<<<<<<< HEAD
<<<<<<< HEAD
=======
    // --- 🛑 NEW: Expiry Management Calculations ---
    const now = new Date()
    now.setHours(0, 0, 0, 0); // Normalize 'now' to start of day for accurate comparison
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    // Get Expired Products (expiryDate < now)
    const expiredProducts = await Product.countDocuments({
      expiryDate: { $lt: now }
    })

    // Get Expiring Soon Products (now <= expiryDate <= 30 days from now)
    const expiringSoonProducts = await Product.countDocuments({
      expiryDate: { $gte: now, $lte: thirtyDaysFromNow }
    })
    // ----------------------------------------------------

>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
=======
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
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
    
<<<<<<< HEAD
<<<<<<< HEAD
    // Get category distribution
    const categoryDistribution = await Product.aggregate([
=======
    // Get category distribution (rest of your existing logic...)
    const categoryDistribution = await Product.aggregate([
      // ... your existing category distribution logic
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
=======
    // Get category distribution
    const categoryDistribution = await Product.aggregate([
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
      // ... your existing monthly trends logic
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
=======
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
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
<<<<<<< HEAD
<<<<<<< HEAD
        monthlyGrowth
=======
        monthlyGrowth,
        // 🛑 NEW: Add expiry data to the summary
        expiredItems: expiredProducts, // Now a count
        expiringSoonItems: expiringSoonProducts, // Now a count
>>>>>>> 572477e4e1dba04a53965b4fbce08a6cbd16e057
=======
        monthlyGrowth
>>>>>>> 57bd35f7e7ab3826e39a8bfe28f88badbeaf9f2e
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