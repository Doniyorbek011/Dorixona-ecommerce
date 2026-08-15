import api from './api';

export const adminService = {
  // 1. Dashboard
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  // 2. Products
  getProducts: async (params = {}) => {
    const res = await api.get('/admin/products', { params });
    return res.data;
  },
  createProduct: async (formData) => {
    const res = await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  updateProduct: async (id, formData) => {
    // We send POST with formData or JSON
    const res = await api.post(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  // 3. Categories
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  // 4. Orders
  getOrders: async (params = {}) => {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },
  updateOrderStatus: async (id, statusData) => {
    const res = await api.put(`/admin/orders/${id}/status`, statusData);
    return res.data;
  },

  // 5. Customers
  getCustomers: async (params = {}) => {
    const res = await api.get('/admin/customers', { params });
    return res.data;
  },
  getCustomer: async (id) => {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data;
  },

  // 6. Inventory
  getInventory: async (params = {}) => {
    const res = await api.get('/admin/inventory', { params });
    return res.data;
  },
  updateStock: async (id, stock) => {
    const res = await api.put(`/admin/inventory/${id}/stock`, { stock });
    return res.data;
  },
};

export default adminService;
