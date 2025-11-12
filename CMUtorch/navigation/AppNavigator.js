import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import ExerciseListScreen from '../screens/Exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import TrackerScreen from '../screens/Tracker/TrackerScreen';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import NutritionScreen from '../screens/Nutrition/NutritionScreen';
import ExerciseScreen from '../screens/Exercise/ExerciseScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent', // ✅ ทำให้โปร่งใส
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
        />
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
        />
        <Stack.Screen
          name="Nutrition"
          component={NutritionScreen}
        />
        <Stack.Screen
          name="NutritionIncrease"
          component={NutritionIncrease}
        />
        
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
