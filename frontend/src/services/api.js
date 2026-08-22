import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details || [],
    };
    return Promise.reject(customError);
  }
);

export default api;
