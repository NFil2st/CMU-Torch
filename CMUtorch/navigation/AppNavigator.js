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
import SignupScreen from '../screens/Login/SignupScreen';

//โปรไฟล์
import ProfileScreen from '../screens/Profile/ProfileScreen';

//หน้าสรุปผล
import SummarizeScreen from '../screens/Summarize/SummarizeScreen';

// widgets
import DailyLogWidget from '../components/common/DailyLogWidget';

//โภชนาการ
import NutritionScreen from '../screens/Nutrition/NutritionScreen';
import NutritionIncrease from '../screens/Nutrition/NutritionIncrease';
import NutritionDecrease from '../screens/Nutrition/NutritionDecrease';
import ScanSuccess from '../screens/Nutrition/ScanSuccess';
import CameraScreen from '../screens/Nutrition/CameraScreen';

//สุขภาพจิต
import MentalScreen from '../screens/Mental/MentalScreen';
import MentalScreenSecond from '../screens/Mental/MentalScreenSecond';
import MentalPositive from '../screens/Mental/MentalPositive';
import MentalNegative from '../screens/Mental/MentalNegative';

//ออกกำลังกาย
import ExerciseScreen from '../screens/Exercise/ExerciseScreen';
import ExerciseListScreen from '../screens/Exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import ExerciseRecommendationScreen from '../screens/Exercise/ExerciseRecomman';

import RankingScreen from '../screens/Ranking/RankingScreen';

import Map from '../screens/Map/Map';

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

        {/* Login Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />

        {/* Widget Screens */}
        <Stack.Screen
          name="DailyLogWidget"
          component={DailyLogWidget}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Tracker"
          component={TrackerScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        {/* Nutrition Screens */}
        <Stack.Screen
          name="Nutrition"
          component={NutritionScreen}
        />
        <Stack.Screen
          name="NutritionIncrease"
          component={NutritionIncrease}
        />
        <Stack.Screen
          name="NutritionDecrease"
          component={NutritionDecrease}
        />
        <Stack.Screen
          name="ScanSuccess"
          component={ScanSuccess}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
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

        {/* Mental */}
        <Stack.Screen
          name="MentalScreen"
          component={MentalScreen}
        />
        <Stack.Screen
          name="MentalScreenSecond"
          component={MentalScreenSecond}
        />
        <Stack.Screen
          name="MentalPositive"
          component={MentalPositive}
        />
        <Stack.Screen
          name="MentalNegative"
          component={MentalNegative}
        />
        <Stack.Screen
          name="RankingScreen"
          component={RankingScreen}
        />
        <Stack.Screen
          name="Map"
          component={Map}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
