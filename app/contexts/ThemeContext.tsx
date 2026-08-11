/**
 * ThemeContext — resolves light/dark (from app.config.json theme + system
 * preference) and exposes the accent color + palette.
 *
 * Platform-agnostic: the entry point (app/index.tsx) passes `systemDark`
 * (RN: useColorScheme, Electron: window.matchMedia). No platform imports here,
 * so this file is byte-identical across templates.
 *
 * @format
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { appConfig } from '@/configs/appConfig';
import { getThemeColors, type ThemeColors } from '@/configs/themes';
import { resolvePalette } from '@/configs/constants';

interface ThemeContextValue {
  palette: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  accent: string;
  setAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  systemDark = false,
}: {
  children: ReactNode;
  systemDark?: boolean;
}) {
  const [override, setOverride] = useState<string | null>(null);

  const palette = useMemo(
    () => resolvePalette(appConfig.theme, systemDark),
    [systemDark],
  );
  const isDark = palette === 'dark';

  // Keep accent in sync when the override changes
  const accent = override ?? appConfig.primaryColor;

  const setAccent = useCallback((color: string) => setOverride(color), []);
  const colors = useMemo(
    () => getThemeColors(palette, accent),
    [palette, accent],
  );

  const value = useMemo(
    () => ({ palette, isDark, colors, accent, setAccent }),
    [palette, isDark, colors, accent, setAccent],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
