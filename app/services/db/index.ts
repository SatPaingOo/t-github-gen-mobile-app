/**
 * Platform SQLite adapter — uniform entry point for the shared core.
 * RN uses @op-engineering/op-sqlite; Electron uses better-sqlite3 (via IPC).
 * The rest of the app only ever imports `sqliteAdapter` from here.
 */

export { sqliteAdapter } from './sqliteAdapter';
