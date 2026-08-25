/**
 * httpClient.ts
 * Axios instance for ElectWin Dashboard.
 * - Attaches JWT Bearer token on every request
 * - Auto-refreshes on 401 using stored refresh token
 * - Refreshes expired real sessions without redirect loops
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL
  ?? ((import.meta as any).env?.PROD ? 'https://votevictory-backend.onrender.com/api/v1' : 'http://localhost:8000/api/v1');

// ─── Token store ─────────────────────────────────────────────────────────────
let _accessToken: string | null = localStorage.getItem('ew_at') ?? null;
let _refreshToken: string | null = localStorage.getItem('ew_rt') ?? null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string) => void> = [];

export const tokenStore = {
  getAccess: () => _accessToken,
  setAccess: (t: string | null) => {
    _accessToken = t;
    if (t) localStorage.setItem('ew_at', t);
    else localStorage.removeItem('ew_at');
  },
  getRefresh: () => _refreshToken,
  setRefresh: (t: string | null) => {
    _refreshToken = t;
    if (t) localStorage.setItem('ew_rt', t);
    else localStorage.removeItem('ew_rt');
  },
  getUser: () => {
    try {
      const raw = localStorage.getItem('ew_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (u: any | null) => {
    if (u) localStorage.setItem('ew_user', JSON.stringify(u));
    else localStorage.removeItem('ew_user');
  },
  setSession: (access: string, refresh: string, user: any) => {
    tokenStore.setAccess(access);
    tokenStore.setRefresh(refresh);
    tokenStore.setUser(user);
  },
  clear: () => {
    _accessToken = null;
    _refreshToken = null;
    localStorage.removeItem('ew_at');
    localStorage.removeItem('ew_rt');
    localStorage.removeItem('ew_user');
  }
};

// ─── Axios instance ───────────────────────────────────────────────────────────
export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s — covers Render free-tier cold start (up to ~80s)
});

// ─── Warm-up ping: wake backend before user hits login ────────────────────────
// Called silently on AuthPage mount. Fire-and-forget, never throws.
export const warmUpServer = () => {
  axios.get(`${BASE_URL}/health`, { timeout: 90000 }).catch(() => {/* silence */});
};

// ─── Request interceptor: attach access token ─────────────────────────────────
httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
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
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
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
      const payload = resp.data.data ?? resp.data;
      const access_token = payload.access_token ?? payload.token;
      const newRt = payload.refresh_token ?? rt;

      tokenStore.setAccess(access_token);
      tokenStore.setRefresh(newRt);

      // Flush queued requests
      _refreshQueue.forEach((cb) => cb(access_token));
      _refreshQueue = [];

      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
      }
      return httpClient(originalRequest);
    } catch (refreshErr) {
      tokenStore.clear();
      _refreshQueue = [];
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      return Promise.reject(refreshErr);
    } finally {
      _isRefreshing = false;
    }
  }
);
