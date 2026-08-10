/**
 * PriorityBadge — small colored chip for a todo priority.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { PRIORITY_META } from '../configs/constants';
import type { TodoPriority } from '../services/types';

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  const meta = PRIORITY_META[priority];

  return (
    <View style={[styles.badge, { backgroundColor: `${meta.color}22` }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
