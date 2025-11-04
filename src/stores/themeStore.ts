import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(newTheme);
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Apply theme by setting CSS variables on the root
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    // Dark theme colors - High contrast for readability
    root.style.setProperty('--bg-primary', '#0F172A'); // secondary-900 - Main background
    root.style.setProperty('--bg-secondary', '#1E293B'); // secondary-800 - Card background
    root.style.setProperty('--bg-tertiary', '#334155'); // secondary-700 - Hover/Active
    root.style.setProperty('--text-primary', '#FFFFFF'); // Pure white for best readability
    root.style.setProperty('--text-secondary', '#CBD5E1'); // secondary-300 - Secondary text
    root.style.setProperty('--text-tertiary', '#94A3B8'); // secondary-400 - Tertiary text
    root.style.setProperty('--border-color', '#334155'); // secondary-700 - Borders
    root.style.setProperty('--card-bg', '#1E293B'); // secondary-800 - Cards
    root.style.setProperty('--hover-bg', '#334155'); // secondary-700 - Hover states
    root.style.setProperty('--input-bg', '#0F172A'); // secondary-900 - Input fields
  } else {
    // Light theme colors - Original high contrast (keep as is)
    root.style.setProperty('--bg-primary', '#F8FAFC'); // secondary-50 - Main background
    root.style.setProperty('--bg-secondary', '#FFFFFF'); // white - Card background
    root.style.setProperty('--bg-tertiary', '#F1F5F9'); // secondary-100 - Hover/Active
    root.style.setProperty('--text-primary', '#0F172A'); // secondary-900 - Primary text
    root.style.setProperty('--text-secondary', '#475569'); // secondary-600 - Secondary text
    root.style.setProperty('--text-tertiary', '#64748B'); // secondary-500 - Tertiary text
    root.style.setProperty('--border-color', '#E2E8F0'); // secondary-200 - Borders
    root.style.setProperty('--card-bg', '#FFFFFF'); // white - Cards
    root.style.setProperty('--hover-bg', '#F1F5F9'); // secondary-100 - Hover states
    root.style.setProperty('--input-bg', '#FFFFFF'); // white - Input fields
  }

  console.log('🎨 Theme applied:', theme);
  console.log('📊 Colors set:', {
    bgPrimary: root.style.getPropertyValue('--bg-primary'),
    textPrimary: root.style.getPropertyValue('--text-primary'),
    cardBg: root.style.getPropertyValue('--card-bg')
  });
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme-storage');
  const theme = savedTheme ? JSON.parse(savedTheme).state.theme : 'light';
  applyTheme(theme);
}
