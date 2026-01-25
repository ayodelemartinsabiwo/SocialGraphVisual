/**
 * Auth API Service
 * @module services/api/auth
 *
 * Authentication API calls for magic link, Google OAuth, and token management.
 */

import { api } from './client';
import type {
  MagicLinkRequestBody,
  MagicLinkRequestResponse,
  MagicLinkVerifyBody,
  MagicLinkVerifyResponse,
  GoogleCallbackBody,
  GoogleCallbackResponse,
  RefreshTokenBody,
  RefreshTokenResponse,
  GetUserResponse,
  UpdateUserBody,
  UpdateUserResponse,
} from '@vsg/shared';

// ============================================================
// MAGIC LINK AUTH
// ============================================================

/**
 * Request a magic link email
 */
export async function requestMagicLink(email: string): Promise<MagicLinkRequestResponse> {
  const body: MagicLinkRequestBody = { email };
  const response = await api.post<MagicLinkRequestResponse>('/auth/magic-link/request', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to request magic link');
  }

  return response.data;
}

/**
 * Verify a magic link token
 */
export async function verifyMagicLink(token: string): Promise<MagicLinkVerifyResponse> {
  const body: MagicLinkVerifyBody = { token };
  const response = await api.post<MagicLinkVerifyResponse>('/auth/magic-link/verify', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to verify magic link');
  }

  return response.data;
}

// ============================================================
// GOOGLE OAUTH
// ============================================================

/**
 * Get Google OAuth URL for redirect
 */
export async function getGoogleAuthUrl(): Promise<{ url: string }> {
  const response = await api.get<{ url: string }>('/auth/google/url');

  if (!response.success || !response.data) {
    throw new Error('Failed to get Google auth URL');
  }

  return response.data;
}

/**
 * Handle Google OAuth callback
 */
export async function handleGoogleCallback(
  code: string,
  state?: string
): Promise<GoogleCallbackResponse> {
  const body: GoogleCallbackBody = { code, state };
  const response = await api.post<GoogleCallbackResponse>('/auth/google/callback', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to authenticate with Google');
  }

  return response.data;
}

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const body: RefreshTokenBody = { refreshToken };
  const response = await api.post<RefreshTokenResponse>('/auth/refresh', body);

  if (!response.success || !response.data) {
    throw new Error('Failed to refresh token');
  }

  return response.data;
}

/**
 * Logout (invalidate tokens)
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

// ============================================================
// USER PROFILE
// ============================================================

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<GetUserResponse> {
  const response = await api.get<GetUserResponse>('/users/me');

  if (!response.success || !response.data) {
    throw new Error('Failed to get user profile');
  }

  return response.data;
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(updates: UpdateUserBody): Promise<UpdateUserResponse> {
  const response = await api.patch<UpdateUserResponse>('/users/me', updates);

  if (!response.success || !response.data) {
    throw new Error('Failed to update user profile');
  }

  return response.data;
}

/**
 * Delete current user account
 */
export async function deleteAccount(): Promise<void> {
  await api.delete('/users/me');
}

// ============================================================
// EXPORTS
// ============================================================

export const authApi = {
  requestMagicLink,
  verifyMagicLink,
  getGoogleAuthUrl,
  handleGoogleCallback,
  refreshToken,
  logout,
  getCurrentUser,
  updateCurrentUser,
  deleteAccount,
};

export default authApi;
