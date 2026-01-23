/**
 * Auth Store
 * @module stores/authStore
 *
 * Zustand store for authentication state management.
 * Handles JWT tokens, user state, and auth flows.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthState {
  // State
  status: AuthStatus;
  user: User | null;
  tokens: AuthTokens | null;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;

  // Auth flows
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Token helpers
  isTokenExpired: () => boolean;
  getAccessToken: () => string | null;
  clearAuth: () => void;
}

// ============================================================
// STORE
// ============================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'idle',
      user: null,
      tokens: null,
      error: null,

      // Basic setters
      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({ tokens }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),

      // Auth flows
      login: (tokens, user) => {
        set({
          tokens,
          user,
          status: 'authenticated',
          error: null,
        });
      },

      logout: () => {
        set({
          tokens: null,
          user: null,
          status: 'unauthenticated',
          error: null,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      // Token helpers
      isTokenExpired: () => {
        const tokens = get().tokens;
        if (!tokens) return true;

        // Add 30 second buffer for expiry check
        return Date.now() >= tokens.expiresAt - 30000;
      },

      getAccessToken: () => {
        const tokens = get().tokens;
        const isExpired = get().isTokenExpired();

        if (!tokens || isExpired) {
          return null;
        }

        return tokens.accessToken;
      },

      clearAuth: () => {
        set({
          tokens: null,
          user: null,
          status: 'unauthenticated',
          error: null,
        });
      },
    }),
    {
      name: 'vsg-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist tokens and user, not status/error
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
      }),
      // Rehydrate status based on stored data
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.tokens && state.user) {
            state.status = state.isTokenExpired() ? 'unauthenticated' : 'authenticated';
          } else {
            state.status = 'unauthenticated';
          }
        }
      },
    }
  )
);

// ============================================================
// SELECTORS
// ============================================================

export const selectIsAuthenticated = (state: AuthState) =>
  state.status === 'authenticated' && !state.isTokenExpired();

export const selectUser = (state: AuthState) => state.user;

export const selectAuthStatus = (state: AuthState) => state.status;

export const selectAuthError = (state: AuthState) => state.error;

export default useAuthStore;
