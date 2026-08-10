/**
 * SQLite schema shared by every platform (RN + Electron).
 *
 * Timestamps are stored as UTC millisecond integers.
 *
 * @format
 */

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS notes (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  color      TEXT NOT NULL DEFAULT '#F59E0B',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS todos (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  done       INTEGER NOT NULL DEFAULT 0,
  priority   TEXT NOT NULL DEFAULT 'medium',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;
