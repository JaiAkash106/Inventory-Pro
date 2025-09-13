import Link from 'next/link'
import { Package, Shield, Zap, BarChart3, ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <Link className="flex items-center justify-center" href="/">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            InventoryPro
          </span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            href="/auth/login"
          >
            Sign In
          </Link>
          <Link
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            href="/auth/register"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:to-indigo-400/5"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-blue-100/50 to-transparent dark:from-blue-900/20 rounded-full blur-3xl"></div>
          
          <div className="relative container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                AI-Powered Inventory Management
              </div>
              
              {/* Heading */}
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    Smart Inventory
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Management
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Transform your inventory operations with AI-powered insights, real-time analytics, and automated workflows. 
                  Built for modern businesses that demand efficiency.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  href="/auth/register"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  href="/auth/login"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>10,000+ Users</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 bg-white dark:bg-gray-900 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to manage inventory
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Powerful features designed to streamline your operations and boost productivity
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bank-level security with role-based access control, data encryption, and compliance standards.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      End-to-end encryption
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Role-based permissions
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Audit trails
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Automation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Intelligent automation for product descriptions, demand forecasting, and inventory optimization.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Auto-generated descriptions
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Smart reorder alerts
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Demand predictions
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Advanced Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Comprehensive dashboards and reports with real-time insights and performance metrics.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Real-time dashboards
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Custom reports
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Export capabilities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your inventory management?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using InventoryPro to streamline their operations.
            </p>
            <Link
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              href="/auth/register"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">InventoryPro</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 InventoryPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}