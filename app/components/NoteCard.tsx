/**
 * NoteCard — tappable card for a note with colored accent + preview + time.
 *
 * @format
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { Note } from '@/services/types';
import { timeAgo, truncate } from '@/configs/constants';
import { IconButton } from '@/components/ui/IconButton';

interface Props {
  note: Note;
  onOpen: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onOpen, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onOpen(note)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: note.color }]} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {note.title || 'Untitled'}
        </Text>
        <Text
          style={[styles.preview, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {truncate(note.body || 'No content', 120)}
        </Text>
        <Text style={[styles.time, { color: colors.textMuted }]}>
          {timeAgo(note.updatedAt)}
        </Text>
      </View>
      <IconButton
        glyph="🗑"
        onPress={() => onDelete(note.id)}
        label="Delete note"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accent: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: 3,
    marginRight: 12,
  },
  body: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  preview: {
    fontSize: 13,
    marginTop: 3,
  },
  time: {
    fontSize: 11,
    marginTop: 6,
  },
});
