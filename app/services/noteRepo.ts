/**
 * NoteRepository — CRUD for notes on top of the DbAdapter.
 * Pure logic, no platform imports.
 *
 * @format
 */

import type { NewNote, Note } from '@/services/types';
import type { DbAdapter } from '@/services/db/types';

let uidCounter = 0;

function genId(): string {
  uidCounter = (uidCounter + 1) % 1000;
  return `${Date.now().toString(36)}-${uidCounter}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function createNoteRepo(db: DbAdapter) {
  return {
    list(): Note[] {
      return db
        .listNotes()
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt);
    },
    get(id: string): Note | null {
      return db.getNote(id);
    },
    add(input: NewNote): Note {
      return db.insertNote(input);
    },
    update(id: string, patch: Partial<NewNote>): Note | null {
      return db.updateNote(id, patch);
    },
    remove(id: string): void {
      db.deleteNote(id);
    },
    createId: genId,
  };
}

export type NoteRepo = ReturnType<typeof createNoteRepo>;
