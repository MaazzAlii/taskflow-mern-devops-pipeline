import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';

    // Auto-redirect to login on 401 (excluding /auth/me or /auth/login endpoints)
    if (status === 401 && !window.location.pathname.startsWith('/login') && !error.config.url.includes('/auth/me')) {
      window.location.href = '/login';
    }

    return Promise.reject({
      message,
      status: status || 500,
    });
  }
);

export default apiClient;
