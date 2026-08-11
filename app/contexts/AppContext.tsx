/**
 * AppContext — owns the SQLite database (via the platform adapter) and exposes
 * Notes + Todos state with CRUD actions. Screens consume this only.
 *
 * The adapter is injected so tests can pass an in-memory mock.
 *
 * @format
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { DbAdapter } from '@/services/db/types';
import { sqliteAdapter } from '@/services/db';
import { createNoteRepo } from '@/services/noteRepo';
import { createTodoRepo } from '@/services/todoRepo';
import type {
  NewNote,
  NewTodo,
  Note,
  Todo,
  TodoPriority,
} from '@/services/types';

interface AppContextValue {
  ready: boolean;
  notes: Note[];
  todos: Todo[];
  addNote: (input: NewNote) => Note;
  updateNote: (id: string, patch: Partial<NewNote>) => void;
  deleteNote: (id: string) => void;
  addTodo: (input: NewTodo) => Todo;
  toggleTodo: (id: string) => void;
  setTodoPriority: (id: string, priority: TodoPriority) => void;
  deleteTodo: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  adapter,
}: {
  children: ReactNode;
  adapter?: DbAdapter;
}) {
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const dbRef = useRef<DbAdapter | null>(null);
  if (!dbRef.current) {
    dbRef.current = adapter ?? sqliteAdapter;
  }
  const repos = useMemo(() => {
    const db = dbRef.current!;
    return { notes: createNoteRepo(db), todos: createTodoRepo(db) };
  }, []);

  useEffect(() => {
    dbRef.current!.init();
    setNotes(repos.notes.list());
    setTodos(repos.todos.list());
    setReady(true);
    return () => dbRef.current?.close();
  }, [repos]);

  const refresh = useCallback(() => {
    setNotes(repos.notes.list());
    setTodos(repos.todos.list());
  }, [repos]);

  const addNote = useCallback(
    (input: NewNote) => {
      const note = repos.notes.add(input);
      refresh();
      return note;
    },
    [repos, refresh],
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<NewNote>) => {
      repos.notes.update(id, patch);
      refresh();
    },
    [repos, refresh],
  );

  const deleteNote = useCallback(
    (id: string) => {
      repos.notes.remove(id);
      refresh();
    },
    [repos, refresh],
  );

  const addTodo = useCallback(
    (input: NewTodo) => {
      const todo = repos.todos.add(input);
      refresh();
      return todo;
    },
    [repos, refresh],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find(t => t.id === id);
      if (todo) repos.todos.toggle(id, !todo.done);
      refresh();
    },
    [repos, todos, refresh],
  );

  const setTodoPriority = useCallback(
    (id: string, priority: TodoPriority) => {
      repos.todos.setPriority(id, priority);
      refresh();
    },
    [repos, refresh],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      repos.todos.remove(id);
      refresh();
    },
    [repos, refresh],
  );

  const value = useMemo(
    () => ({
      ready,
      notes,
      todos,
      addNote,
      updateNote,
      deleteNote,
      addTodo,
      toggleTodo,
      setTodoPriority,
      deleteTodo,
    }),
    [
      ready,
      notes,
      todos,
      addNote,
      updateNote,
      deleteNote,
      addTodo,
      toggleTodo,
      setTodoPriority,
      deleteTodo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
