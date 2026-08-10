/**
 * Theme palettes — resolved from app.config.json `theme` + `primaryColor`.
 *
 * @format
 */

import type { ThemeMode } from '../config/appConfig';

export interface Palette {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  onAccent: string;
}

const lightPalette: Palette = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  onAccent: '#FFFFFF',
};

const darkPalette: Palette = {
  background: '#111827',
  surface: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  onAccent: '#FFFFFF',
};

export function getPalette(isDark: boolean): Palette {
  return isDark ? darkPalette : lightPalette;
}

export function resolveDark(theme: ThemeMode, systemDark: boolean): boolean {
  return theme === 'dark' || (theme === 'system' && systemDark);
}
