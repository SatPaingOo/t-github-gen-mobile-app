/**
 * TodoItem — row with checkbox, title, priority chip and delete.
 * Long-press the priority chip cycles low → medium → high.
 *
 * @format
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { PRIORITIES, PRIORITY_META } from '../configs/constants';
import type { Todo, TodoPriority } from '../services/types';
import { PriorityBadge } from './PriorityBadge';
import { IconButton } from './ui/IconButton';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onCyclePriority: (id: string, priority: TodoPriority) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onCyclePriority, onDelete }: Props) {
  const { colors } = useTheme();
  const nextPriority = PRIORITIES[(PRIORITY_META[todo.priority].order + 1) % PRIORITIES.length];

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        onPress={() => onToggle(todo.id)}
        hitSlop={6}
        style={[styles.check, { borderColor: todo.done ? colors.success : colors.border }]}>
        {todo.done ? <Text style={{ fontSize: 13, color: colors.success }}>✓</Text> : null}
      </Pressable>
      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            { color: todo.done ? colors.textMuted : colors.text },
            todo.done && styles.doneText,
          ]}
          numberOfLines={2}>
          {todo.title}
        </Text>
        <Pressable onPress={() => onCyclePriority(todo.id, nextPriority)} hitSlop={6}>
          <PriorityBadge priority={todo.priority} />
        </Pressable>
      </View>
      <IconButton glyph="🗑" onPress={() => onDelete(todo.id)} label="Delete todo" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: {
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
});
