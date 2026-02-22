// constants.ts
import axios from 'axios';
export const USERS_URL = '/api/users';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string
  || 'https://innofarms-backend-app.redmeadow-fe576561.westus2.azurecontainerapps.io';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies by default 🍪
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/apps';
      }
    }
    return Promise.reject(error);
  }
);