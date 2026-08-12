/**
 * AppHeader — brand header with the app logo + name.
 * Uses assets/logo.png (the same file the generate script writes from the
 * user's uploaded logo, or the default logo when none was provided).
 *
 * @format
 */

import { Image, StyleSheet, Text, View } from 'react-native';
import { appConfig } from '@/configs/appConfig';
import { useTheme } from '@/contexts/ThemeContext';

export function AppHeader() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <View style={styles.textWrap}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {appConfig.appName}
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          {appConfig.platforms.join(' + ')} · v{appConfig.version}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  sub: {
    fontSize: 11,
    marginTop: 1,
  },
});
