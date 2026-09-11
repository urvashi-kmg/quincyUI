import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'quincy.theme';

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Tailwind `class`-strategy dark mode toggle — see .claude/rules/styling.md. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, setTheme };
}
