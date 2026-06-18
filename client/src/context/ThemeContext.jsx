import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'shopez-theme';
const THEMES = ['pine', 'mauve', 'terracotta', 'midnight'];

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.includes(stored)) return stored;
  }
  return 'midnight';
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t) => {
    if (THEMES.includes(t)) setThemeState(t);
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = THEMES.indexOf(theme);
    setThemeState(THEMES[(idx + 1) % THEMES.length]);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
