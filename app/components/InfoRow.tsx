/**
 * InfoRow — one label/value line inside an InfoCard.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme';

interface Props {
  label: string;
  value: string;
  last?: boolean;
}

export function InfoRow({ label, value, last }: Props) {
  const { palette } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: palette.border },
      ]}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.textPrimary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 12,
  },
});
