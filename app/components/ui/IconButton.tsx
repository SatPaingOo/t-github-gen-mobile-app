/**
 * IconButton — pressable icon wrapper (uses text glyphs to avoid an icon lib).
 *
 * @format
 */

import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  glyph: string;
  onPress: () => void;
  color?: string;
  size?: number;
  label?: string;
}

export function IconButton({ glyph, onPress, color, size = 20, label }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label ?? glyph}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <Text
        style={{
          fontSize: size,
          color: color ?? colors.textMuted,
          lineHeight: size + 2,
        }}
      >
        {glyph}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});
