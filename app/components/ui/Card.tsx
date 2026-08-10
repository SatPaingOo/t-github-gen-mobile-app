/**
 * Card — surface container with border + subtle shadow.
 *
 * @format
 */

import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface Props extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, style, children, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: padded ? 14 : 0,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
