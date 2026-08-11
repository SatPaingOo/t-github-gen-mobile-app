/**
 * NotesScreen — searchable list of note cards + create/edit/delete.
 *
 * @format
 */

import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NoteCard } from '@/components/NoteCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import type { Note } from '@/services/types';
import { AddNoteModal } from '@/screens/AddNoteModal';

export function NotesScreen() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const filtered = query
    ? notes.filter(
        n =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.body.toLowerCase().includes(query.toLowerCase()),
      )
    : notes;

  const confirmDelete = (id: string) => {
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchWrap}>
        <View
          style={[
            styles.search,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search notes…"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <IconButton
          glyph="✚"
          onPress={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          color={colors.accent}
          size={22}
          label="Add note"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={n => n.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onOpen={note => {
              setEditing(note);
              setModalOpen(true);
            }}
            onDelete={confirmDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            glyph={query ? '🔍' : '🗒'}
            title={query ? 'No matches' : 'No notes yet'}
            subtitle={
              query
                ? 'Try a different search.'
                : 'Tap + to create your first note.'
            }
          />
        }
      />

      <AddNoteModal
        visible={modalOpen}
        note={editing}
        onClose={() => setModalOpen(false)}
        onSave={input => {
          if (editing) updateNote(editing.id, input);
          else addNote(input);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    paddingVertical: 10,
    fontSize: 14,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
});
