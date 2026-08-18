/**
 * httpClient.ts
 * Axios instance for ElectWin Dashboard.
 * - Attaches JWT Bearer token from in-memory store on every request
 * - Auto-refreshes on 401 using stored refresh token
 * - On refresh failure → clears auth state and redirects to /login
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

// ─── Token store (in-memory; avoids XSS risk of storing access token in localStorage) ───
let _accessToken: string | null = null;
let _refreshToken: string | null = localStorage.getItem('ew_rt') ?? null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

export const tokenStore = {
  getAccess: () => _accessToken,
  setAccess: (t: string | null) => { _accessToken = t; },
  getRefresh: () => _refreshToken,
  setRefresh: (t: string | null) => {
    _refreshToken = t;
    if (t) localStorage.setItem('ew_rt', t);
    else localStorage.removeItem('ew_rt');
  },
  clear: () => {
    _accessToken = null;
    _refreshToken = null;
    localStorage.removeItem('ew_rt');
  }
};

// ─── Axios instance ───────────────────────────────────────────────────────────
export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ─── Request interceptor: attach access token ─────────────────────────────────
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 → refresh → retry ──────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const rt = tokenStore.getRefresh();
    if (!rt) {
      // No refresh token — force logout
      tokenStore.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (_isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve) => {
        _refreshQueue.push((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          originalRequest._retry = true;
          resolve(httpClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    _isRefreshing = true;

    try {
      const resp = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: rt
      });
      const { access_token, refresh_token: newRt } = resp.data.data ?? resp.data;
      tokenStore.setAccess(access_token);
      tokenStore.setRefresh(newRt);

      // Flush queued requests
      _refreshQueue.forEach((cb) => cb(access_token));
      _refreshQueue = [];

      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
      }
      return httpClient(originalRequest);
    } catch {
      tokenStore.clear();
      _refreshQueue = [];
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      _isRefreshing = false;
    }
  }
);
