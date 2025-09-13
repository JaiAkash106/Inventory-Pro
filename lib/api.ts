import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
}

// Products API
export const productsAPI = {
  getAll: (params?: { search?: string; category?: string; page?: number; limit?: number }) => 
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
}

// Reports API
export const reportsAPI = {
  getLowStock: () => api.get('/reports/low-stock'),
  getTopProducts: () => api.get('/reports/top-products'),
  getCategoryDistribution: () => api.get('/reports/category-distribution'),
  generateAIInsights: () => api.post('/reports/ai-insights'),
}

// AI API
export const aiAPI = {
  generateDescription: (name: string, category: string) => 
    api.post('/ai/generate-description', { name, category }),
  generateReport: (type: string, data: any) => 
    api.post('/ai/generate-report', { type, data }),
}

export default api