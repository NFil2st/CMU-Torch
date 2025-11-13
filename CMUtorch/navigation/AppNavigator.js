import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//หน้าหลัก
import HomeScreen from '../screens/Home/HomeScreen';
import TrackerScreen from '../screens/Tracker/TrackerScreen';

//หน้าโหลดเข้่าแอพ
import SplashScreen from '../screens/Splash/SplashScreen';

//หน้าเข้าสู่ระบบ
import LoginScreen from '../screens/Login/LoginScreen';

//โปรไฟล์
import ProfileScreen from '../screens/Profile/ProfileScreen';

//หน้าสรุปผล
import SummarizeScreen from '../screens/Summarize/SummarizeScreen';

//โภชนาการ
import NutritionScreen from '../screens/Nutrition/NutritionScreen';
import NutritionIncrease from '../screens/Nutrition/NutritionIncrease';

//ออกกำลังกาย
import ExerciseScreen from '../screens/Exercise/ExerciseScreen';
import ExerciseListScreen from '../screens/Exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import ExerciseRecommendationScreen from '../screens/Exercise/ExerciseRecomman';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
          animation: 'fade',
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
          name="Nutrition"
          component={NutritionScreen}
        />
        <Stack.Screen
          name="NutritionIncrease"
          component={NutritionIncrease}
        />
        
        {/* Profile Screens */
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />}

        {/* Summarize Screens */}
        <Stack.Screen
          name="Summarize"
          component={SummarizeScreen}
        />

        {/* Exercise Screens */}
        <Stack.Screen
          name="Exercise"
          component={ExerciseScreen}
        />
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
        />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
        />
        <Stack.Screen
          name="ExerciseRecommendation"
          component={ExerciseRecommendationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
