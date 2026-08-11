/**
 * TodoRepository — CRUD for todos on top of the DbAdapter.
 * Pure logic, no platform imports.
 *
 * @format
 */

import { PRIORITY_META } from '@/configs/constants';
import type { NewTodo, Todo, TodoPriority } from '@/services/types';
import type { DbAdapter } from '@/services/db/types';

export function createTodoRepo(db: DbAdapter) {
  return {
    list(): Todo[] {
      return db
        .listTodos()
        .slice()
        .sort((a, b) => {
          const done = Number(a.done) - Number(b.done);
          if (done !== 0) return done;
          return (
            PRIORITY_META[b.priority].order - PRIORITY_META[a.priority].order
          );
        });
    },
    add(input: NewTodo): Todo {
      return db.insertTodo(input);
    },
    toggle(id: string, done: boolean): Todo | null {
      return db.updateTodo(id, { done });
    },
    setPriority(id: string, priority: TodoPriority): Todo | null {
      return db.updateTodo(id, { priority });
    },
    updateTitle(id: string, title: string): Todo | null {
      return db.updateTodo(id, { title });
    },
    remove(id: string): void {
      db.deleteTodo(id);
    },
  };
}

export type TodoRepo = ReturnType<typeof createTodoRepo>;
