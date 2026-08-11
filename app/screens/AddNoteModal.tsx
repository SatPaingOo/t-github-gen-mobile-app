/**
 * AddNoteModal — create / edit a note with title, body and a color picker.
 *
 * @format
 */

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { NOTE_COLORS } from '@/configs/constants';
import type { Note } from '@/services/types';

interface Props {
  visible: boolean;
  note: Note | null; // null = create
  onSave: (input: { title: string; body: string; color: string }) => void;
  onClose: () => void;
}

export function AddNoteModal({ visible, note, onSave, onClose }: Props) {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? '');
      setBody(note?.body ?? '');
      setColor(note?.color ?? NOTE_COLORS[0]);
    }
  }, [visible, note]);

  const submit = () => {
    onSave({ title: title.trim(), body: body.trim(), color });
    onClose();
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {note ? 'Edit note' : 'New note'}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={[styles.cancel, { color: colors.textMuted }]}>
                Cancel
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={inputStyle}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={[inputStyle, styles.bodyInput]}
            placeholder="Write something…"
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
          />

          <View style={styles.colorRow}>
            {NOTE_COLORS.map(c => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  color === c && {
                    borderWidth: 3,
                    borderColor: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />
            ))}
          </View>

          <Pressable
            onPress={submit}
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.saveText}>
              {note ? 'Save changes' : 'Add note'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cancel: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  bodyInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
