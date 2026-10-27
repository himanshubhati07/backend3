import axios from 'axios';
import { toast } from 'svelte-sonner';

// Create axios instance with base URL from environment or empty (relative URLs)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Authorization token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    const authData = JSON.parse(token);
    if (authData.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
  }
  return config;
});

// Response interceptor: handle errors and show toast
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.statusText) {
      message = error.response.statusText;
    } else if (error.message) {
      message = error.message;
    }

    // Show error toast only once per request
    toast.error(message);

    return Promise.reject(error);
  }
);
