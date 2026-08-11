/**
 * Typed access to the generated app's configuration.
 *
 * `app.config.json` is pushed by the TGen website and is read at bundle time
 * by Metro — no build step needed on the JS side.
 *
 * @format
 */

import rawConfig from '@appConfig';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppConfig {
  schemaVersion: number;
  appName: string;
  slug: string;
  theme: ThemeMode;
  primaryColor: string;
  logoUrl: string;
  supportEmail: string;
  platforms: string[];
  packageName: string;
  version: string;
}

export const appConfig = rawConfig as AppConfig;
