import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

/**
 * Determines the resolved theme based on system preference
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolves the actual theme to apply
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Theme Store
 *
 * Manages the application's color theme with:
 * - Persistence to localStorage
 * - System preference detection
 * - Real-time system preference updates
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        const resolvedTheme = resolveTheme(theme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        const resolvedTheme = resolveTheme(newTheme);
        set({ theme: newTheme, resolvedTheme });
      },

      initializeTheme: () => {
        const { theme } = get();
        const resolvedTheme = resolveTheme(theme);
        set({ resolvedTheme });

        // Listen for system preference changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const { theme } = get();
            if (theme === 'system') {
              set({ resolvedTheme: getSystemTheme() });
            }
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'vsg-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export type { Theme, ResolvedTheme };
