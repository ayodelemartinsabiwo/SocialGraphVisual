/**
 * API Client
 * @module services/api/client
 *
 * Axios-based API client with automatic token refresh,
 * request/response interceptors, and error handling.
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { useAuthStore } from '../../stores/authStore';

// ============================================================
// TYPES
// ============================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// ============================================================
// CONFIGURATION
// ============================================================

// Use relative URL to go through Vite's proxy in development
// This avoids CORS issues since requests go to the same origin
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/magic-link/request',
  '/auth/magic-link/verify',
  '/auth/google/callback',
  '/auth/refresh',
  '/csrf-token',
  '/health',
];

// CSRF token fetch state
let csrfTokenFetched = false;
let csrfTokenFetchPromise: Promise<void> | null = null;

// ============================================================
// CREATE CLIENT
// ============================================================

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies for CSRF
  });

  // Request interceptor - add auth token and CSRF
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Skip auth for public endpoints
      const isPublic = PUBLIC_ENDPOINTS.some((ep) =>
        config.url?.includes(ep)
      );

      if (!isPublic) {
        const authStore = useAuthStore.getState();
        const accessToken = authStore.getAccessToken();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // For state-changing requests, ensure CSRF token exists
      const isStateChanging = ['post', 'put', 'patch', 'delete'].includes(
        config.method?.toLowerCase() || ''
      );

      if (isStateChanging) {
        await ensureCsrfToken();
      }

      // Get CSRF token from cookie and add to header
      const csrfToken = getCsrfTokenFromCookie();
      if (csrfToken && isStateChanging) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newTokens = await refreshAccessToken();
          if (newTokens) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Transform error response
      const apiError: ApiError = {
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        message:
          error.response?.data?.error?.message ||
          error.message ||
          'An unexpected error occurred',
        details: error.response?.data?.error?.details,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Get CSRF token from cookie
 */
function getCsrfTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    // Match the backend CSRF cookie name: csrf_token
    if (name === 'csrf_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Fetch CSRF token from the API (sets the cookie)
 */
async function fetchCsrfToken(): Promise<void> {
  if (csrfTokenFetched) return;

  // Deduplicate concurrent requests
  if (csrfTokenFetchPromise) {
    return csrfTokenFetchPromise;
  }

  csrfTokenFetchPromise = (async () => {
    try {
      await axios.get(`${API_BASE_URL}/csrf-token`, {
        withCredentials: true,
      });
      csrfTokenFetched = true;
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
    } finally {
      csrfTokenFetchPromise = null;
    }
  })();

  return csrfTokenFetchPromise;
}

/**
 * Ensure CSRF token is available before state-changing requests
 */
async function ensureCsrfToken(): Promise<void> {
  const existingToken = getCsrfTokenFromCookie();
  if (!existingToken) {
    await fetchCsrfToken();
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
} | null> {
  const authStore = useAuthStore.getState();
  const tokens = authStore.tokens;

  if (!tokens?.refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<
      ApiResponse<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }>
    >(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken: tokens.refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    if (response.data.success && response.data.data) {
      const newTokens = {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        expiresAt: Date.now() + response.data.data.expiresIn * 1000,
      };

      authStore.setTokens(newTokens);
      return newTokens;
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================================
// EXPORTS
// ============================================================

export const apiClient = createApiClient();

/**
 * Initialize CSRF protection by fetching the token
 * Call this early in app lifecycle for better UX
 */
export const initializeCsrf = fetchCsrfToken;

// Convenience methods
export const api = {
  get: <T>(url: string, config?: object) =>
    apiClient.get<ApiResponse<T>>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: object) =>
    apiClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: object) =>
    apiClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: object) =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: object) =>
    apiClient.delete<ApiResponse<T>>(url, config).then((res) => res.data),
};

export default api;
