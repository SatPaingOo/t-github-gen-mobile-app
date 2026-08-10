/**
 * Screen — themed background wrapper for a screen.
 *
 * @format
 */

import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export function Screen({ style, children, ...rest }: ViewProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
