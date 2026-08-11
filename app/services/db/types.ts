/**
 * Database adapter contract.
 *
 * The repo layer only talks to this interface, so the same CRUD logic runs on
 * every platform. Each platform provides a concrete adapter:
 *   - React Native: app/services/db/opSqliteAdapter.ts (op-sqlite)
 *   - Electron:     app/src/services/db/ (better-sqlite3 via IPC)
 *
 * All operations are synchronous so consumers never await.
 *
 * @format
 */

import type { NewNote, NewTodo, Note, Todo } from '@/services/types';

export interface DbAdapter {
  init(): void;
  close(): void;
  listNotes(): Note[];
  getNote(id: string): Note | null;
  insertNote(note: NewNote): Note;
  updateNote(id: string, patch: Partial<NewNote>): Note | null;
  deleteNote(id: string): void;
  listTodos(): Todo[];
  insertTodo(todo: NewTodo): Todo;
  updateTodo(
    id: string,
    patch: Partial<Pick<Todo, 'title' | 'done' | 'priority'>>,
  ): Todo | null;
  deleteTodo(id: string): void;
}
