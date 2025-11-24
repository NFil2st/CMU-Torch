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

import AboutScreen from '../screens/About/AboutScreen';

//โภชนาการ
import NutritionScreen from '../screens/Nutrition/NutritionScreen';
import NutritionList from '../screens/Nutrition/NutritionList';
import ScanSuccess from '../screens/Nutrition/ScanSuccess';
import CameraScreen from '../screens/Nutrition/CameraScreen';

//สุขภาพจิต
import MentalScreen from '../screens/Mental/MentalScreen';
import MentalResultScreen from '../screens/Mental/MentalResultScreen';

//ออกกำลังกาย
import ExerciseScreen from '../screens/Exercise/ExerciseScreen';
import ExerciseListScreen from '../screens/Exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/Exercise/ExerciseDetailScreen';
import ExerciseRecommendationScreen from '../screens/Exercise/ExerciseRecomman';
import ExerciseCooldown from '../screens/Exercise/ExerciseCooldown';

import RankingScreen from '../screens/Ranking/RankingScreen';

import Map from '../screens/Map/Map';
import mapFood from '../screens/Map/mapFood';

import SettingScreen from '../screens/Setting/SettingScreen';

import StackHistoryScreen from '../screens/History/StackHistoryScreen';

//evrnt
import EventScreen from '../screens/Event/eventScreen';
import EventMap from '../screens/Event/eventMap';

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
          name="NutritionList"
          component={NutritionList}
        />
        <Stack.Screen
          name="ScanSuccess"
          component={ScanSuccess}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
        />
        {/* About Screen */}
        <Stack.Screen
          name="About"
          component={AboutScreen}
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
        <Stack.Screen
          name="ExerciseCooldown"
          component={ExerciseCooldown}
        />

        {/* Mental */}
        <Stack.Screen
          name="MentalScreen"
          component={MentalScreen}
        />
        <Stack.Screen
          name="MentalResultScreen"
          component={MentalResultScreen}
        />

        {/* Ranking Screen */}

        <Stack.Screen
          name="RankingScreen"
          component={RankingScreen}
        />

        {/* Map Screen */}
        <Stack.Screen
          name="Map"
          component={Map}
        />
        <Stack.Screen
          name="mapFood"
          component={mapFood}
        />

        {/* Setting Screen */}
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
        />
        <Stack.Screen
          name="AboutMe"
          component={AboutScreen}
        />

        {/* Event Screen */}
        <Stack.Screen
          name="EventScreen"
          component={EventScreen}
        />
        <Stack.Screen
          name="EventMap"
          component={EventMap}
        />

        {/* Stack History Screen */}
        <Stack.Screen
          name="StackHistory"
          component={StackHistoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
