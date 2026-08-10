/**
 * Shared domain types for the Notes + Todos app.
 * Mirrored in the Electron template (electron template keeps its own copy
 * because the two repos are generated independently).
 *
 * @format
 */

export interface Note {
  id: string;
  title: string;
  body: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface NewNote {
  title: string;
  body: string;
  color: string;
}

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: TodoPriority;
  createdAt: number;
  updatedAt: number;
}

export interface NewTodo {
  title: string;
  priority: TodoPriority;
}
