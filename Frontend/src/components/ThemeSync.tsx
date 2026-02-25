import React, { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const ThemeSync: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Prevent flash by setting class before render
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return null;
};
