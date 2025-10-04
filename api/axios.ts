import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed, e.g., for auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming JWT stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, e.g., unauthorized
    if (error.response?.status === 401) {
      // Redirect to login or handle logout
    }
    return Promise.reject(error);
  }
);