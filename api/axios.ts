import axios from "axios";
import { parseCookies } from "nookies";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed, e.g., for auth token
axiosInstance.interceptors.request.use((config) => {
  let token = null;

  const cookies = parseCookies();
  token = cookies?.token ? cookies.token : null;
  console.log("Token from cookies:", token);

  // Client-side: Fallback to localStorage
  if (typeof window !== "undefined" && !token) {
    token = localStorage.getItem("token");
    token = token ? token : null;
    console.log("Client-side - Token from localStorage:", token);
  }
  // const token = cookies?.token;
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
