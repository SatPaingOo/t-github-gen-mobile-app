/**
 * BrandBar — accent-colored strip at the top of the screen.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme';

export function BrandBar() {
  const { accent } = useAppTheme();

  return (
    <View style={[styles.bar, { backgroundColor: accent }]}>
      <Text style={styles.text}>Generated with TGen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
