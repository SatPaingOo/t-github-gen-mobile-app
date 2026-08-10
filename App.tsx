/**
 * Generated app home screen.
 *
 * This is a config-driven sample app. All branding values are read from
 * `app.config.json` (pushed by the generate website / rewritten by
 * `scripts/generate.mjs`) at bundle time, so the JS side needs no
 * placeholders — native configs are handled by the generate script.
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// NOTE: bundled at build time from the repo's app.config.json
import config from './app.config.json';

const isDark = config.theme === 'dark';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const accent = config.primaryColor;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#F9FAFB', paddingTop: safeAreaInsets.top },
      ]}>
      {/* Brand header */}
      <View style={[styles.brandBar, { backgroundColor: accent }]}>
        <Text style={styles.brandBarText}>Generated with TGen</Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.icon, { backgroundColor: accent }]}>
          <Text style={styles.iconText}>{config.appName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.appName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          {config.appName}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          React Native {config.platforms.join(' + ')} app
        </Text>

        <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Row label="Theme" value={config.theme} isDark={isDark} />
          <Row label="Version" value={config.version} isDark={isDark} />
          <Row label="Package" value={config.packageName} isDark={isDark} />
          <Row label="Support" value={config.supportEmail} isDark={isDark} last />
        </View>

        <Text style={[styles.footer, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Customize me — edit app.config.json and rebuild.
        </Text>
      </View>
    </View>
  );
}

function Row({ label, value, isDark, last }: { label: string; value: string; isDark: boolean; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
      <Text style={[styles.rowLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: isDark ? '#F9FAFB' : '#111827' }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandBar: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  brandBarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '700',
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
  card: {
    alignSelf: 'stretch',
    borderRadius: 16,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 12,
  },
  footer: {
    fontSize: 13,
    marginTop: 24,
  },
});

export default App;
