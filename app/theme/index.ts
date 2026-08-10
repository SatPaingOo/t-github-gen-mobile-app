/**
 * useAppTheme — resolves dark/light + accent color from app.config.json.
 *
 * @format
 */

import { useColorScheme } from 'react-native';
import { appConfig } from '../config/appConfig';
import { getPalette, resolveDark, type Palette } from './colors';

export interface AppTheme {
  isDark: boolean;
  palette: Palette;
  accent: string;
}

export function useAppTheme(): AppTheme {
  const systemDark = useColorScheme() === 'dark';
  const isDark = resolveDark(appConfig.theme, systemDark);
  return {
    isDark,
    palette: getPalette(isDark),
    accent: appConfig.primaryColor,
  };
}
