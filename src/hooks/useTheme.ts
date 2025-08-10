import { useState, useEffect } from 'react';
import { Theme } from '../types';
import { lightTheme, darkTheme } from '../theme';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false); // Default to light theme

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
    // Removed auto dark mode detection - always default to light
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme: Theme = isDark ? darkTheme : lightTheme;

  return { theme, isDark, toggleTheme };
};