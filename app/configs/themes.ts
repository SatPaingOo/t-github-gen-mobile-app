/**
 * Theme palettes.
 *
 * `accent` is overridden at runtime by app.config.json `primaryColor` so the
 * branding is visible everywhere (buttons, badges, active tab, brand bar).
 *
 * @format
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  danger: string;
  dangerSoft: string;
  success: string;
}

export const lightColors: ThemeColors = {
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  accent: '#3B82F6',
  accentSoft: '#DBEAFE',
  onAccent: '#FFFFFF',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  success: '#22C55E',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#0B1220',
  border: '#334155',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  accent: '#3B82F6',
  accentSoft: '#1E3A5F',
  onAccent: '#FFFFFF',
  danger: '#F87171',
  dangerSoft: '#4C1D1D',
  success: '#4ADE80',
};

export type Palette = 'light' | 'dark';

export function getThemeColors(palette: Palette, accent: string): ThemeColors {
  const base = palette === 'dark' ? darkColors : lightColors;
  return { ...base, accent, accentSoft: base.accentSoft };
}
