'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Download,
    TrendingUp,
    TrendingDown,
    Package,
    AlertTriangle,
    DollarSign,
    BarChart3,
    Calendar,
    Filter,
    Wand2
} from 'lucide-react'
import toast from 'react-hot-toast'

type ReportsData = {
    summary: {
        totalProducts: number
        totalValue: number
        lowStockItems: number
        outOfStock: number
        topCategory: string
        monthlyGrowth: number
    }
    categoryDistribution: {
        _id: string
        count: number
        totalValue: number
    }[]
    monthlyTrends: {
        _id: string
        totalValue: number
    }[]
    recentActivity: {
        name: string
        quantity: number
        price: number
        updatedAt: string
    }[]
}

async function fetchReportsData() {
    const response = await fetch('/api/reports')
    if (!response.ok) {
        throw new Error('Failed to fetch reports data')
    }
    return response.json()
}

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month')
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)

    const { data: reportData, isLoading } = useQuery<ReportsData>({
        queryKey: ['reports', selectedPeriod],
        queryFn: fetchReportsData,
    })

    const [aiInsights, setAiInsights] = useState<any>(null)

    const generateAIReport = async () => {
        setIsGeneratingReport(true)
        try {
            const response = await fetch('/api/ai/insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to generate insights')
            }

            const data = await response.json()
            setAiInsights(data.insights)
            toast.success('AI insights generated successfully!')
        } catch (error) {
            toast.error('Failed to generate AI insights')
        } finally {
            setIsGeneratingReport(false)
        }
    }

    const exportReport = () => {
        toast.success('Report exported successfully!')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!reportData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No data available</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600">Comprehensive inventory insights and analytics</p>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                    <button
                        onClick={generateAIReport}
                        disabled={isGeneratingReport}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isGeneratingReport ? 'Generating...' : 'AI Insights'}
                    </button>
                    <button
                        onClick={exportReport}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Period:</span>
                    </div>
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalProducts}</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{reportData.summary.monthlyGrowth.toFixed(1)}% from last month
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${reportData.summary.totalValue.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{reportData.summary.monthlyGrowth.toFixed(1)}% from last month
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.summary.lowStockItems}</p>
                            <p className="text-xs text-yellow-600 flex items-center mt-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Requires attention
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Package className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.summary.outOfStock}</p>
                            <p className="text-xs text-red-600 flex items-center mt-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Critical attention needed
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Category Distribution
                    </h3>
                    <div className="space-y-4">
                        {reportData.categoryDistribution.map((category, index) => {
                            const total = reportData.categoryDistribution.reduce((sum, cat) => sum + cat.count, 0)
                            const percentage = ((category.count / total) * 100).toFixed(1)

                            return (
                                <div key={category._id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                                            index === 1 ? 'bg-green-500' :
                                                index === 2 ? 'bg-yellow-500' :
                                                    index === 3 ? 'bg-purple-500' : 'bg-red-500'
                                            }`}></div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {category._id}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {category.count} items ({percentage}%)
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ${category.totalValue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {reportData.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{activity.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Updated {new Date(activity.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {activity.quantity} units
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        ${activity.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Trends
                </h3>
                <div className="space-y-4">
                    {reportData.monthlyTrends.map((trend) => (
                        <div key={trend._id} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                                {new Date(trend._id).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                            <span className="font-semibold text-gray-900">
                                ${trend.totalValue.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Wand2 className="w-5 h-5 mr-2 text-blue-500" />
                        AI-Powered Insights
                    </h3>
                    {!aiInsights && (
                        <button
                            onClick={generateAIReport}
                            disabled={isGeneratingReport}
                            className="btn-secondary text-sm flex items-center"
                        >
                            <Wand2 className="w-4 h-4 mr-1" />
                            {isGeneratingReport ? 'Analyzing...' : 'Generate Insights'}
                        </button>
                    )}
                </div>

                {aiInsights ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(aiInsights).map((insight: any, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-blue-800 hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {insight.message}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Wand2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Generate AI-powered insights to get personalized recommendations for your inventory
                        </p>
                        <button
                            onClick={generateAIReport}
                            disabled={isGeneratingReport}
                            className="btn-primary flex items-center mx-auto"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            {isGeneratingReport ? 'Analyzing Data...' : 'Generate AI Insights'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}