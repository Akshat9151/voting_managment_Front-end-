import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandColor = '#0284c7' | '#7c3aed' | '#059669' | '#d97706' | '#e11d48';

interface ThemeContextType {
  primaryColor: BrandColor;
  setPrimaryColor: (color: BrandColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColorState] = useState<BrandColor>(() => {
    return (localStorage.getItem('electwin_theme_color') as BrandColor) || '#0284c7';
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--cyan-primary', primaryColor);
    document.documentElement.style.setProperty('--brand-primary', primaryColor);
  }, [primaryColor]);

  const setPrimaryColor = (color: BrandColor) => {
    setPrimaryColorState(color);
    localStorage.setItem('electwin_theme_color', color);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
