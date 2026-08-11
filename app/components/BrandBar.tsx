/**
 * BrandBar — brand strip at the top. Uses the secondary color (accent = primary),
 * so both brand colors are visible in the app.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { appConfig } from '@/configs/appConfig';

export function BrandBar() {
  const secondary = appConfig.secondaryColor || appConfig.primaryColor;

  return (
    <View style={[styles.bar, { backgroundColor: secondary }]}>
      <Text style={styles.text}>{appConfig.appName}</Text>
      <Text style={styles.sub}>· TGen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
});
