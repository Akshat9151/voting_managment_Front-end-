import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandColor = '#0284c7' | '#7c3aed' | '#059669' | '#d97706' | '#e11d48';
export type Theme = 'light' | 'dark';

interface ThemeContextType {
  primaryColor: BrandColor;
  setPrimaryColor: (color: BrandColor) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredPreference = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem('electwin_theme_mode');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore localStorage access issues in restricted environments
  }
  return null;
};

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColorState] = useState<BrandColor>(() => {
    try {
      return (window.localStorage.getItem('electwin_theme_color') as BrandColor) || '#0284c7';
    } catch {
      return '#0284c7';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => getStoredPreference() ?? getSystemTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;

    const base = theme === 'dark' ? '#020817' : '#f8fafc';
    const surface = theme === 'dark' ? '#0f172a' : '#ffffff';
    const surfaceSubtle = theme === 'dark' ? '#111827' : '#f1f5f9';
    const surfaceHover = theme === 'dark' ? '#1e293b' : '#e2e8f0';
    const textPrimary = theme === 'dark' ? '#e2e8f0' : '#0f172a';
    const textSecondary = theme === 'dark' ? '#cbd5e1' : '#475569';
    const border = theme === 'dark' ? '#334155' : '#e2e8f0';

    root.style.setProperty('--bg-base', base);
    root.style.setProperty('--bg-surface', surface);
    root.style.setProperty('--bg-surface-subtle', surfaceSubtle);
    root.style.setProperty('--bg-surface-hover', surfaceHover);
    root.style.setProperty('--text-primary', textPrimary);
    root.style.setProperty('--text-secondary', textSecondary);
    root.style.setProperty('--border-color', border);
    root.style.setProperty('--brand-primary', primaryColor);
    root.style.setProperty('--brand-primary-soft', `${primaryColor}20`);
    root.style.setProperty('--brand-primary-border', `${primaryColor}4d`);
    root.style.setProperty('--brand-primary-glow', `${primaryColor}33`);

    try {
      window.localStorage.setItem('electwin_theme_mode', theme);
    } catch {
      // ignore localStorage access issues in restricted environments
    }
  }, [theme, primaryColor]);

  useEffect(() => {
    try {
      window.localStorage.setItem('electwin_theme_color', primaryColor);
    } catch {
      // ignore localStorage access issues in restricted environments
    }
  }, [primaryColor]);

  const setPrimaryColor = (color: BrandColor) => {
    setPrimaryColorState(color);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
