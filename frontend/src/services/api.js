import axios from 'axios';

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

// Response interceptor: Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
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
