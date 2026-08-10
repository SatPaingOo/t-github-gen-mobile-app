/**
 * InfoCard — surface card showing the generated app's config values.
 *
 * @format
 */

import { StyleSheet, View } from 'react-native';
import { appConfig } from '../config/appConfig';
import { useAppTheme } from '../theme';
import { InfoRow } from './InfoRow';

export function InfoCard() {
  const { palette } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.surface }]}>
      <InfoRow label="Theme" value={appConfig.theme} />
      <InfoRow label="Version" value={appConfig.version} />
      <InfoRow label="Package" value={appConfig.packageName} />
      <InfoRow label="Support" value={appConfig.supportEmail} last />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
});
