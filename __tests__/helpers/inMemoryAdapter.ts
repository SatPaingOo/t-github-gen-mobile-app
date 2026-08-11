/**
 * In-memory DbAdapter for tests.
 *
 * Uses the op-sqlite Jest mock's connection so the adapter code path is
 * exercised exactly like production (INSERT/SELECT/UPDATE/DELETE).
 *
 * @format
 */

import { open } from '@op-engineering/op-sqlite';
import { SCHEMA_SQL } from '@/services/db/schema';
import type { DbAdapter } from '@/services/db/types';
import type {
  NewNote,
  NewTodo,
  Note,
  Todo,
  TodoPriority,
} from '@/services/types';

export function createInMemoryAdapter(): DbAdapter {
  const db = open({ name: 'test.db' });
  db.executeSync(SCHEMA_SQL);

  const now = () => Date.now();

  const toNote = (row: Record<string, unknown>): Note => ({
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ''),
    color: String(row.color ?? '#F59E0B'),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  });

  const toTodo = (row: Record<string, unknown>): Todo => ({
    id: String(row.id),
    title: String(row.title),
    done: Boolean(Number(row.done)),
    priority: String(row.priority) as TodoPriority,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  });

  return {
    init() {},
    close() {},

    listNotes: () => db.executeSync('SELECT * FROM notes').rows.map(toNote),
    getNote: id => {
      const found = db.executeSync('SELECT * FROM notes WHERE id = ?', [
        id,
      ]).rows;
      return found.length ? toNote(found[0]) : null;
    },
    insertNote(note: NewNote) {
      const ts = now();
      const row: Note = {
        id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        ...note,
        createdAt: ts,
        updatedAt: ts,
      };
      db.executeSync(
        'INSERT INTO notes (id, title, body, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [row.id, row.title, row.body, row.color, row.createdAt, row.updatedAt],
      );
      return row;
    },
    updateNote(id, patch) {
      const existing = this.getNote(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      db.executeSync(
        'UPDATE notes SET title = ?, body = ?, color = ?, updated_at = ? WHERE id = ?',
        [next.title, next.body, next.color, next.updatedAt, id],
      );
      return next;
    },
    deleteNote: id => db.executeSync('DELETE FROM notes WHERE id = ?', [id]),

    listTodos: () => db.executeSync('SELECT * FROM todos').rows.map(toTodo),
    insertTodo(todo: NewTodo) {
      const ts = now();
      const row: Todo = {
        id: `${ts.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
        done: false,
        ...todo,
        createdAt: ts,
        updatedAt: ts,
      };
      db.executeSync(
        'INSERT INTO todos (id, title, done, priority, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          row.id,
          row.title,
          row.done ? 1 : 0,
          row.priority,
          row.createdAt,
          row.updatedAt,
        ],
      );
      return row;
    },
    updateTodo(id, patch) {
      const existing = this.listTodos().find(t => t.id === id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: now() };
      db.executeSync(
        'UPDATE todos SET title = ?, done = ?, priority = ?, updated_at = ? WHERE id = ?',
        [next.title, next.done ? 1 : 0, next.priority, next.updatedAt, id],
      );
      return next;
    },
    deleteTodo: id => db.executeSync('DELETE FROM todos WHERE id = ?', [id]),
  };
}
