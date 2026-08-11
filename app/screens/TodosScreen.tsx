/**
 * TodosScreen — add/complete/delete todos with priority cycling + progress bar.
 *
 * @format
 */

import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TodoItem } from '@/components/TodoItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import type { TodoPriority } from '@/services/types';

export function TodosScreen() {
  const { todos, addTodo, toggleTodo, setTodoPriority, deleteTodo } = useApp();
  const { colors } = useTheme();
  const [draft, setDraft] = useState('');

  const done = todos.filter(t => t.done).length;
  const progress = todos.length ? Math.round((done / todos.length) * 100) : 0;

  const submit = () => {
    const title = draft.trim();
    if (!title) return;
    addTodo({ title, priority: 'medium' });
    setDraft('');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.summary, { backgroundColor: colors.surfaceAlt }]}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.accent, width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.summaryText, { color: colors.textMuted }]}>
          {done} of {todos.length} done · {progress}%
        </Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={[
            styles.addInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Add a task…"
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
          returnKeyType="done"
        />
        <IconButton
          glyph="✚"
          onPress={submit}
          color={colors.accent}
          size={22}
          label="Add task"
        />
      </View>

      <FlatList
        data={todos}
        keyExtractor={t => t.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={toggleTodo}
            onCyclePriority={(id, priority: TodoPriority) =>
              setTodoPriority(id, priority)
            }
            onDelete={deleteTodo}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            glyph="✅"
            title="All clear!"
            subtitle="Add a task to get started."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(127,127,127,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  list: {
    padding: 16,
    paddingTop: 4,
  },
});
