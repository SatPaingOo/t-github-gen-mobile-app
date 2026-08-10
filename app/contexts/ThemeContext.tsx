/**
 * ThemeContext — resolves light/dark (from app.config.json theme + system
 * preference) and exposes the accent color + palette.
 *
 * The accent is pulled from app.config.json primaryColor so switching the
 * generated brand color is visible across the whole UI.
 *
 * @format
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { appConfig } from '../configs/appConfig';
import { getThemeColors, type ThemeColors } from '../configs/themes';
import { resolvePalette } from '../configs/constants';

interface ThemeContextValue {
  palette: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  accent: string;
  setAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemDark = useColorScheme() === 'dark';
  const [override, setOverride] = useState<string | null>(null);

  const palette = useMemo(() => resolvePalette(appConfig.theme, systemDark), [systemDark]);
  const isDark = palette === 'dark';

  // Keep accent in sync when the override changes
  const accent = override ?? appConfig.primaryColor;

  const setAccent = useCallback((color: string) => setOverride(color), []);
  const colors = useMemo(() => getThemeColors(palette, accent), [palette, accent]);

  const value = useMemo(
    () => ({ palette, isDark, colors, accent, setAccent }),
    [palette, isDark, colors, accent, setAccent],
  );

  // Reflect the palette on the root (for StatusBar we use it in App).
  useEffect(() => {
    // noop — StatusBar handled by screens
  }, [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
