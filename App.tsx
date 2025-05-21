import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from './src/themes/ThemeContext';
import { BackendProvider } from './src/api/BackendContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <BackendProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </BackendProvider>
    </SafeAreaProvider>
  );
}
