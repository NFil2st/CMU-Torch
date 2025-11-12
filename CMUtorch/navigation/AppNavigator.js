import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import ExerciseListScreen from '../screens/Exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import TrackerScreen from '../screens/Tracker/TrackerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent', // ✅ ทำให้โปร่งใส
          },
        }}
      >
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
        />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
