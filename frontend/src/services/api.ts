import axios from 'axios';
import { store } from '../store';
import { logout, loginSuccess } from '../store/authSlice';

export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const rToken = localStorage.getItem('refreshToken');

      if (rToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh-token`, { token: rToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Dispatch loginSuccess to Redux
          const currentUserState = store.getState().auth.user;
          if (currentUserState) {
            store.dispatch(loginSuccess({
              user: currentUserState,
              accessToken,
              refreshToken: newRefreshToken
            }));
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh token expired or invalid, log out
          store.dispatch(logout());
          return Promise.reject(refreshErr);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
