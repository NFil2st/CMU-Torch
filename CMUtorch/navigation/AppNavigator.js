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
      <Stack.Navigator>
        {/* หน้าแรกที่เปิด */}
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
          options={{ title: '🏠 Tracker', headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '🏠 Home', headerShown: false }}
        />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
