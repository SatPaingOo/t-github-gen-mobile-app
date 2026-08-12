/**
 * AboutScreen — app info + TGen info + in-app theme switcher.
 *
 * The theme switcher (Light / Dark / System) overrides the configured theme
 * for this session, so users can try themes without regenerating the app.
 *
 * @format
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appConfig } from '@/configs/appConfig';
import { TGenInfo, truncate } from '@/configs/constants';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeMode } from '@/configs/appConfig';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { colors, accent, themeMode, setThemeMode } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, paddingTop: insets.top }}
      contentContainerStyle={styles.wrap}
    >
      {/* App identity */}
      <View style={styles.center}>
        <View style={[styles.appIcon, { backgroundColor: accent }]}>
          <Text style={styles.appIconText}>
            {appConfig.appName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>
          {appConfig.appName}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {appConfig.platforms.join(' + ')} app · v{appConfig.version}
        </Text>
      </View>

      {/* Theme switcher */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>Theme</Text>
        <View
          style={[
            styles.segmented,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
        >
          {THEME_OPTIONS.map(opt => {
            const active = themeMode === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setThemeMode(opt.value)}
                style={[styles.segment, active && { backgroundColor: accent }]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? '#FFFFFF' : colors.textMuted },
                    active && { fontWeight: '700' },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {themeMode === 'system'
            ? 'Follows your device theme.'
            : `${
                themeMode === 'light' ? 'Light' : 'Dark'
              } theme — applied now.`}
        </Text>
      </View>

      {/* App details */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>App info</Text>
        <Row label="Version" value={appConfig.version} colors={colors} />
        <Row label="Package" value={appConfig.packageName} colors={colors} />
        <Row
          label="Support"
          value={appConfig.supportEmail}
          colors={colors}
          last
        />
      </View>

      {/* TGen info */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          About TGen
        </Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          {truncate(TGenInfo.description, 240)}
        </Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Powered by TGen · {TGenInfo.url}
        </Text>
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        Made with TGen · v{appConfig.version}
      </Text>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: { text: string; textMuted: string; border: string };
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
  },
  segment: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 13,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 12,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
