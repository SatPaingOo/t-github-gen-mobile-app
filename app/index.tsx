/**
 * Root App component — composes providers + the home screen.
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './screens/HomeScreen';
import { useAppTheme } from './theme';

function App() {
  const { isDark } = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
