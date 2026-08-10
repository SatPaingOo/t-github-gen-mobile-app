/**
 * AppIcon — rounded brand square with the app's first letter.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { appConfig } from '../config/appConfig';
import { useAppTheme } from '../theme';

export function AppIcon() {
  const { accent } = useAppTheme();

  return (
    <View style={[styles.icon, { backgroundColor: accent }]}>
      <Text style={styles.letter}>{appConfig.appName.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '700',
  },
});
