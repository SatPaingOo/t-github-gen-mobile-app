/**
 * HomeScreen — main generated-app screen.
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { BrandBar } from '../components/BrandBar';
import { InfoCard } from '../components/InfoCard';
import { appConfig } from '../config/appConfig';
import { useAppTheme } from '../theme';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useAppTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: palette.background, paddingTop: insets.top }]}>
      <BrandBar />
      <View style={styles.body}>
        <AppIcon />
        <Text style={[styles.appName, { color: palette.textPrimary }]}>{appConfig.appName}</Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          React Native {appConfig.platforms.join(' + ')} app
        </Text>

        <View style={styles.cardWrap}>
          <InfoCard />
        </View>

        <Text style={[styles.footer, { color: palette.textSecondary }]}>
          Customize me — edit app.config.json and rebuild.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  cardWrap: {
    alignSelf: 'stretch',
    marginTop: 32,
  },
  footer: {
    fontSize: 13,
    marginTop: 24,
  },
});
