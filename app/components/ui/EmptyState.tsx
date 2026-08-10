/**
 * EmptyState — friendly placeholder for empty lists.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  glyph: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ glyph, title, subtitle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.glyphCircle, { backgroundColor: colors.accentSoft }]}>
        <Text style={[styles.glyph, { color: colors.accent }]}>{glyph}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  glyphCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  glyph: {
    fontSize: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});
