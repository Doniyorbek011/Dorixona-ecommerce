import { create } from 'zustand';
import authService from '../services/authService';

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.login?.[0] ||
        'Kirishda xatolik yuz berdi. Ma’lumotlarni tekshiring.';
      set({
        isLoading: false,
        error: errorMsg,
      });
      return { success: false, error: errorMsg, errors: err.response?.data?.errors };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Ro‘yxatdan o‘tishda xatolik yuz berdi.';
      set({
        isLoading: false,
        error: errorMsg,
      });
      return { success: false, error: errorMsg, errors: err.response?.data?.errors };
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (e) {
      // Ignore network logout errors and clean local state
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Refresh profile from server
  fetchProfile: async () => {
    if (!get().token) return;
    try {
      const data = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true });
    } catch (err) {
      if (err.response?.status === 401) {
        get().logout();
      }
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.updateProfile(profileData);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, isLoading: false, error: null });
      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Profilni yangilashda xatolik yuz berdi.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg, errors: err.response?.data?.errors };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
