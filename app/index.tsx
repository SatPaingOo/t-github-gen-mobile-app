/**
 * Root App — providers + bottom tab navigation (Notes / Todos).
 *
 * @format
 */

import { useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AppHeader } from '@/components/AppHeader';
import { NotesScreen } from '@/screens/NotesScreen';
import { TodosScreen } from '@/screens/TodosScreen';
import { AboutScreen } from '@/screens/AboutScreen';

type Tab = 'notes' | 'todos' | 'about';

const TABS: { key: Tab; label: string; glyph: string }[] = [
  { key: 'notes', label: 'Notes', glyph: '🗒' },
  { key: 'todos', label: 'Todos', glyph: '✅' },
  { key: 'about', label: 'About', glyph: 'ℹ️' },
];

function Shell() {
  const [tab, setTab] = useState<Tab>('notes');
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppHeader />

      <View style={styles.content}>
        {tab === 'notes' ? (
          <NotesScreen />
        ) : tab === 'todos' ? (
          <TodosScreen />
        ) : (
          <AboutScreen />
        )}
      </View>

      <View
        style={[
          styles.tabBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={styles.tab}
              onPress={() => setTab(t.key)}
            >
              <Text style={{ fontSize: 18 }}>{t.glyph}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? colors.accent : colors.textMuted },
                  active && { fontWeight: '700' },
                ]}
              >
                {t.label}
              </Text>
              {active ? (
                <View
                  style={[styles.tabDot, { backgroundColor: colors.accent }]}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function App() {
  const systemDark = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider systemDark={systemDark}>
        <AppProvider>
          <Shell />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
