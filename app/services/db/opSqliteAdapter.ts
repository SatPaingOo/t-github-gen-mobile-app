/**
 * React Native SQLite adapter built on @op-engineering/op-sqlite.
 *
 * Implements the shared DbAdapter contract. All methods are synchronous —
 * op-sqlite runs synchronously (WAL mode by default).
 *
 * @format
 */

import { open } from '@op-engineering/op-sqlite';
import { SCHEMA_SQL } from './schema';
import type { DbAdapter } from './types';
import type { NewNote, NewTodo, Note, Todo, TodoPriority } from '../types';

type SqliteResult = { rows: Record<string, unknown>[]; rowsAffected: number };

let db: ReturnType<typeof open> | null = null;

function ensureDb() {
  if (!db) {
    db = open({ name: 'tgen.db' });
    db.executeSync(SCHEMA_SQL);
  }
  return db;
}

function rows(result: SqliteResult): Record<string, unknown>[] {
  return result?.rows ?? [];
}

function now(): number {
  return Date.now();
}

function toNote(row: Record<string, unknown>): Note {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ''),
    color: String(row.color ?? '#F59E0B'),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

function toTodo(row: Record<string, unknown>): Todo {
  return {
    id: String(row.id),
    title: String(row.title),
    done: Boolean(Number(row.done)),
    priority: String(row.priority) as TodoPriority,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function createOpSqliteAdapter(): DbAdapter {
  return {
    init(): void {
      ensureDb();
    },
    close(): void {
      try {
        db?.close();
      } catch {
        // already closed
      }
      db = null;
    },

    listNotes(): Note[] {
      return rows(ensureDb().executeSync('SELECT * FROM notes')).map(toNote);
    },
    getNote(id: string): Note | null {
      const found = rows(ensureDb().executeSync('SELECT * FROM notes WHERE id = ?', [id]));
      return found.length ? toNote(found[0]) : null;
    },
    insertNote(note: NewNote): Note {
      const ts = now();
      const row: Note = {
        id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        ...note,
        createdAt: ts,
        updatedAt: ts,
      };
      ensureDb().executeSync(
        'INSERT INTO notes (id, title, body, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [row.id, row.title, row.body, row.color, row.createdAt, row.updatedAt],
      );
      return row;
    },
    updateNote(id: string, patch: Partial<NewNote>): Note | null {
      const existing = this.getNote(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      ensureDb().executeSync(
        'UPDATE notes SET title = ?, body = ?, color = ?, updated_at = ? WHERE id = ?',
        [next.title, next.body, next.color, next.updatedAt, id],
      );
      return next;
    },
    deleteNote(id: string): void {
      ensureDb().executeSync('DELETE FROM notes WHERE id = ?', [id]);
    },

    listTodos(): Todo[] {
      return rows(ensureDb().executeSync('SELECT * FROM todos')).map(toTodo);
    },
    insertTodo(todo: NewTodo): Todo {
      const ts = now();
      const row: Todo = {
        id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        done: false,
        ...todo,
        createdAt: ts,
        updatedAt: ts,
      };
      ensureDb().executeSync(
        'INSERT INTO todos (id, title, done, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [row.id, row.title, row.done ? 1 : 0, row.priority, row.createdAt, row.updatedAt],
      );
      return row;
    },
    updateTodo(
      id: string,
      patch: Partial<Pick<Todo, 'title' | 'done' | 'priority'>>,
    ): Todo | null {
      const existing = this.listTodos().find(t => t.id === id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      ensureDb().executeSync(
        'UPDATE todos SET title = ?, done = ?, priority = ?, updated_at = ? WHERE id = ?',
        [next.title, next.done ? 1 : 0, next.priority, next.updatedAt, id],
      );
      return next;
    },
    deleteTodo(id: string): void {
      ensureDb().executeSync('DELETE FROM todos WHERE id = ?', [id]);
    },
  };
}
