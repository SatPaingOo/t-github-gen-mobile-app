/**
 * ThemeContext — resolves light/dark (from app.config.json theme + system
 * preference) and exposes the accent color + palette.
 *
 * The user can also override the theme in-app via `setThemeMode` (the About
 * screen has a Light/Dark/System switcher). The override is kept in memory
 * for the session; the config theme is the default.
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
import { appConfig, type ThemeMode } from '@/configs/appConfig';
import { getThemeColors, type ThemeColors } from '@/configs/themes';
import { resolvePalette } from '@/configs/constants';

interface ThemeContextValue {
  palette: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  accent: string;
  setAccent: (color: string) => void;
  /** Effective theme mode — in-app override if set, else the config theme. */
  themeMode: ThemeMode;
  /** Switch the app theme in-app (About screen). null = use config theme. */
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  systemDark = false,
}: {
  children: ReactNode;
  systemDark?: boolean;
}) {
  const [accentOverride, setAccentOverride] = useState<string | null>(null);
  const [themeOverride, setThemeOverride] = useState<ThemeMode | null>(null);

  const themeMode = themeOverride ?? appConfig.theme;
  const palette = useMemo(
    () => resolvePalette(themeMode, systemDark),
    [themeMode, systemDark],
  );
  const isDark = palette === 'dark';

  // Keep accent in sync when the override changes
  const accent = accentOverride ?? appConfig.primaryColor;

  const setAccent = useCallback(
    (color: string) => setAccentOverride(color),
    [],
  );
  const setThemeMode = useCallback(
    (mode: ThemeMode) => setThemeOverride(mode),
    [],
  );
  const colors = useMemo(
    () => getThemeColors(palette, accent),
    [palette, accent],
  );

  const value = useMemo(
    () => ({
      palette,
      isDark,
      colors,
      accent,
      setAccent,
      themeMode,
      setThemeMode,
    }),
    [palette, isDark, colors, accent, setAccent, themeMode, setThemeMode],
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
