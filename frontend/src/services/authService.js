import api from './api';

export const authService = {
  // Login with email or phone
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register new customer
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Log out and invalidate Sanctum token
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (e) {
      // Local clean-up even if network fails
      return { status: 'success' };
    }
  },

  // Get current authenticated user profile
  getProfile: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  // Update profile details / password
  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Request password reset
  forgotPassword: async (emailData) => {
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
  },

  // Submit new password with reset token
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Admin stats
  getAdminStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
};

export default authService;
