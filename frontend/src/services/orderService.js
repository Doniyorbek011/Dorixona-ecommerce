import api from './api';

export const orderService = {
  // Create order from current cart
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get customer's orders history
  getOrders: async (page = 1) => {
    const response = await api.get(`/orders?page=${page}`);
    return response.data;
  },

  // Get customer's single order details
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Admin: Get all orders
  getAdminOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/admin/orders/${id}/status`, statusData);
    return response.data;
  },
};

export default orderService;
