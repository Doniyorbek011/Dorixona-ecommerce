import api from './api';

export const cartService = {
  // Fetch current user cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async ({ product_id, quantity = 1 }) => {
    const response = await api.post('/cart', { product_id, quantity });
    return response.data;
  },

  // Update item quantity
  updateQuantity: async (id, quantity) => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },

  // Remove single item
  removeFromCart: async (id) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },

  // Sync guest cart to server
  syncCart: async (items) => {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  },
};

export default cartService;
