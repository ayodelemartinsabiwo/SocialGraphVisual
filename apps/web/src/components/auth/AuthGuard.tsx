/**
 * Auth Guard Component
 * @module components/auth/AuthGuard
 *
 * Protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectAuthStatus } from '@/stores/authStore';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard - Protects routes based on authentication status
 *
 * @param children - The components to render if authenticated
 * @param requireAuth - Whether authentication is required (default: true)
 */
export function AuthGuard({ children, requireAuth = true }: AuthGuardProps): JSX.Element {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const status = useAuthStore(selectAuthStatus);
  const location = useLocation();

  // Show loading while checking auth status
  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If auth is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    // Save the attempted URL for redirect after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If auth is NOT required (e.g., login page) and user IS authenticated, redirect to app
  if (!requireAuth && isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/graph';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

/**
 * RequireAuth - Convenience wrapper that requires authentication
 */
export function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  return <AuthGuard requireAuth>{children}</AuthGuard>;
}

/**
 * RequireGuest - Convenience wrapper for guest-only routes (login, register)
 */
export function RequireGuest({ children }: { children: React.ReactNode }): JSX.Element {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}

export default AuthGuard;
