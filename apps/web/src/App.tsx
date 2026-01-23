import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import Layout from '@/components/layout/Layout';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { RequireAuth } from '@/components/auth/AuthGuard';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('@/components/landing/LandingPage'));
const UploadPage = lazy(() => import('@/components/upload/UploadPage'));
const GraphPage = lazy(() => import('@/components/graph/GraphPage'));
const InsightsPage = lazy(() => import('@/components/insights/InsightsPage'));
const SettingsPage = lazy(() => import('@/components/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'));

/**
 * Visual Social Graph - Main Application Component
 *
 * This is the root component that handles:
 * - Theme management (light/dark mode)
 * - Authentication state initialization
 * - Routing configuration with auth guards
 * - Global layout structure
 * - Code splitting with lazy loading
 */
function App() {
  const { theme, initializeTheme } = useThemeStore();
  const authStatus = useAuthStore((state) => state.status);
  const tokens = useAuthStore((state) => state.tokens);

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Initialize auth status on mount
  useEffect(() => {
    // If we have tokens stored but status is idle, check if they're valid
    if (authStatus === 'idle' && tokens) {
      const isExpired = Date.now() >= (tokens.expiresAt - 30000);
      useAuthStore.setState({
        status: isExpired ? 'unauthenticated' : 'authenticated',
      });
    } else if (authStatus === 'idle') {
      useAuthStore.setState({ status: 'unauthenticated' });
    }
  }, [authStatus, tokens]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        {/* App routes with layout - protected by auth guard */}
        <Route element={<Layout />}>
          <Route
            path="/upload"
            element={
              <RequireAuth>
                <UploadPage />
              </RequireAuth>
            }
          />
          <Route
            path="/graph"
            element={
              <RequireAuth>
                <GraphPage />
              </RequireAuth>
            }
          />
          <Route
            path="/graph/:id"
            element={
              <RequireAuth>
                <GraphPage />
              </RequireAuth>
            }
          />
          <Route
            path="/insights"
            element={
              <RequireAuth>
                <InsightsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/insights/:id"
            element={
              <RequireAuth>
                <InsightsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
