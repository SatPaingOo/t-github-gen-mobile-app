/**
 * Shared-core unit tests — the SAME file lives in both the RN and Electron
 * templates and runs under jest (RN) / vitest (Electron). It proves the repo
 * logic (notes/todos CRUD + sorting) is identical on both platforms.
 *
 * Uses a self-contained in-memory DbAdapter — no sqlite dependency, so it runs
 * anywhere.
 */

import { createNoteRepo } from '../noteRepo';
import { createTodoRepo } from '../todoRepo';
import type { DbAdapter } from '../db/types';
import type { NewNote, NewTodo, Note, Todo } from '../types';

function createMemoryAdapter(): DbAdapter {
  const notes = new Map<string, Note>();
  const todos = new Map<string, Todo>();
  let seq = 0;
  let clock = 0;
  const id = () => `id-${++seq}`;
  const tick = () => (clock += 1); // monotonic, so sort order is deterministic

  return {
    init() {},
    close() {},

    listNotes: () => [...notes.values()],
    getNote: id => notes.get(id) ?? null,
    insertNote(n: NewNote) {
      const now = tick();
      const note: Note = { id: id(), ...n, createdAt: now, updatedAt: now };
      notes.set(note.id, note);
      return note;
    },
    updateNote(id, patch) {
      const existing = notes.get(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: tick() };
      notes.set(id, next);
      return next;
    },
    deleteNote: id => void notes.delete(id),

    listTodos: () => [...todos.values()],
    insertTodo(t: NewTodo) {
      const now = tick();
      const todo: Todo = {
        id: id(),
        done: false,
        ...t,
        createdAt: now,
        updatedAt: now,
      };
      todos.set(todo.id, todo);
      return todo;
    },
    updateTodo(id, patch) {
      const existing = todos.get(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: tick() } as Todo;
      todos.set(id, next);
      return next;
    },
    deleteTodo: id => void todos.delete(id),
  };
}

describe('shared noteRepo', () => {
  const repo = createNoteRepo(createMemoryAdapter());

  it('adds and lists notes sorted by updatedAt desc', () => {
    repo.add({ title: 'first', body: 'a', color: '#FF0000' });
    const b = repo.add({ title: 'second', body: 'b', color: '#00FF00' });
    repo.update(b.id, { title: 'second updated' });

    const list = repo.list();
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe(b.id);
    expect(list[0].title).toBe('second updated');
  });

  it('updates and deletes a note', () => {
    const n = repo.add({ title: 'temp', body: '', color: '#0000FF' });
    const updated = repo.update(n.id, { body: 'edited' });
    expect(updated?.body).toBe('edited');
    repo.remove(n.id);
    expect(repo.get(n.id)).toBeNull();
  });
});

describe('shared todoRepo', () => {
  const repo = createTodoRepo(createMemoryAdapter());

  it('sorts incomplete first, then by priority order', () => {
    repo.add({ title: 'low', priority: 'low' });
    const high = repo.add({ title: 'high', priority: 'high' });
    repo.add({ title: 'done high', priority: 'high' });
    // mark the last added as done
    const all = repo.list();
    const doneHigh = all.find(t => t.title === 'done high')!;
    repo.toggle(doneHigh.id, true);

    const list = repo.list();
    expect(list[0].title).toBe(high.title); // high priority, not done
    expect(list[list.length - 1].title).toBe('done high'); // done last
  });

  it('cycles priority and deletes', () => {
    const t = repo.add({ title: 'cycle', priority: 'medium' });
    repo.setPriority(t.id, 'high');
    expect(repo.list()[0].priority).toBe('high');
    repo.remove(t.id);
    expect(repo.list().some(x => x.id === t.id)).toBe(false);
  });
});
