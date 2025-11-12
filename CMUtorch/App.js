import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import AppBackground from './components/common/AppBackground';

export default function App() {
  return (
    <AppBackground>
      <AppNavigator />
      <StatusBar style="auto" />
    </AppBackground>
  );
}