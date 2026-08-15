import axios from 'axios';
import { useToastStore } from '../store/toastStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Request interceptor: Attach auth token and active locale
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const locale = localStorage.getItem('locale') || 'uz';
    config.headers['Accept-Language'] = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle common HTTP status codes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { addToast } = useToastStore.getState();

    if (!error.response) {
      // Network or offline error
      addToast({
        message: 'Internet yoki server bilan aloqa yo‘q. Iltimos, ulanishni tekshiring.',
        type: 'error',
      });
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const currentPath = window.location.pathname;

    switch (status) {
      case 401:
        // Unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (currentPath !== '/login' && currentPath !== '/register') {
          addToast({
            message: 'Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.',
            type: 'warning',
          });
        }
        break;

      case 403:
        // Forbidden
        addToast({
          message: data?.message || 'Ushbu amalni bajarish uchun sizda yetarli ruxsat yo‘q.',
          type: 'error',
        });
        break;

      case 404:
        // Not Found
        // Only show toast if explicitly requesting an existing resource
        if (!currentPath.startsWith('/products')) {
          addToast({
            message: data?.message || 'So‘ralgan ma’lumot yoki sahifa topilmadi.',
            type: 'warning',
          });
        }
        break;

      case 422:
        // Validation Error: formatted message
        const firstError = data?.errors
          ? Object.values(data.errors)[0]?.[0]
          : data?.message || 'Ma’lumotlar noto‘g‘ri kiritildi.';
        addToast({
          message: firstError,
          type: 'error',
        });
        break;

      case 429:
        // Too Many Requests / Rate Limiting
        addToast({
          message: 'So‘rovlar soni ko‘payib ketdi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
          type: 'warning',
        });
        break;

      case 500:
      case 502:
      case 503:
        // Internal Server Error
        addToast({
          message: 'Serverda vaqtincha texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.',
          type: 'error',
        });
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

// Health check service to verify backend connection
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
