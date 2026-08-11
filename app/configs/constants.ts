/**
 * Shared constants + small formatting helpers.
 *
 * @format
 */

import type { AppConfig } from '@/configs/appConfig';

/** Accent colors offered when editing a note. */
export const NOTE_COLORS = [
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#64748B',
];

export type TodoPriority = 'low' | 'medium' | 'high';

export const PRIORITY_META: Record<
  TodoPriority,
  { label: string; color: string; order: number }
> = {
  low: { label: 'Low', color: '#22C55E', order: 0 },
  medium: { label: 'Med', color: '#F59E0B', order: 1 },
  high: { label: 'High', color: '#EF4444', order: 2 },
};

export const PRIORITIES: TodoPriority[] = ['low', 'medium', 'high'];

/** "5m ago" style relative time, given a UTC millisecond timestamp. */
export function timeAgo(ts: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/** Resolve the effective palette from app.config.json theme (+ system pref). */
export function resolvePalette(
  theme: AppConfig['theme'],
  systemDark: boolean,
): 'light' | 'dark' {
  if (theme === 'system') return systemDark ? 'dark' : 'light';
  return theme;
}
