'use client';

import { useTheme } from 'next-themes';

export const useThemeMode = () => {
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  // if theme is system get systemTheme value (dark or light) else get value of
  // the theme
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return { currentTheme, resolvedTheme, setTheme };
};
