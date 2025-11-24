import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🚨 ต้อง Import AsyncStorage
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

// 🚨 กำหนดตัวแปร API URL ภายนอก Component
const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
const GET_PLACES_API_ENDPOINT = `${API_BASE_URL}/api/getExercisePlaces`; 

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  /**
   * 🆕 ฟังก์ชันดึงข้อมูลสถานที่ (ฝังอยู่ใน Component)
   */
  const fetchPlaces = useCallback(async (exerciseTitle) => { // ฟังก์ชันนี้เป็น async อยู่แล้ว
    setIsLoading(true);
    setIsError(false);
    
    // 1. สร้าง Endpoint พร้อม Query Parameter
    const url = `${GET_PLACES_API_ENDPOINT}?title=${encodeURIComponent(exerciseTitle)}`;
    
    try {
      // 2. ดึง Token จาก AsyncStorage (หรือ Context/Hook)
      const token = await AsyncStorage.getItem('userToken'); 

      if (!token) {
          // ต้องจัดการกรณีผู้ใช้ไม่ได้ Login
          throw new Error('User not logged in. Cannot fetch data.');
      }
      
      // 3. เรียก fetch API
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ใช้ Token จริง
          "Content-Type": "application/json",
        },
      });
      // ❌ [START FIX] โค้ดที่หายไปหรือผิดพลาดก่อนหน้านี้
      // บรรทัดนี้คือจุดที่ Syntax Error เกิดขึ้นในเวอร์ชันก่อนหน้า
      // ตอนนี้โค้ดกลับมาสมบูรณ์แล้ว
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown API error' }));
        console.error(`API Error (${res.status}):`, errorData.message);
        throw new Error(`Failed to fetch exercise places: ${res.status}`);
      }

      const jsonResponse = await res.json();
      
      if (!jsonResponse.success || !jsonResponse.data) {
          throw new Error('API returned success=false or missing data.');
      }
      // ❌ [END FIX]

      // ข้อมูลที่ได้ (jsonResponse.data) คือ array ของสถานที่
      setPlaces(jsonResponse.data);

    } catch (error) {
      // ตรวจจับ Error จาก await AsyncStorage.getItem, fetch, และ throw new Error
      console.error("Failed to load places:", error);
      setIsError(true);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchPlaces(exercise.title);
  }, [exercise.title, fetchPlaces]);


  // --- Animation Logic (คงไว้) ---
  const scaleAnimsRef = useRef([]);
  const darkAnimsRef = useRef([]);

  useEffect(() => {
    scaleAnimsRef.current = places.map(() => new Animated.Value(1));
    darkAnimsRef.current = places.map(() => new Animated.Value(0));
  }, [places]);

  const handlePressIn = (index) => {
    if (scaleAnimsRef.current[index]) {
      Animated.parallel([
        Animated.spring(scaleAnimsRef.current[index], { toValue: 0.97, useNativeDriver: true }),
        Animated.timing(darkAnimsRef.current[index], { toValue: 0.2, duration: 120, useNativeDriver: false }),
      ]).start();
    }
  };

  const handlePressOut = (index) => {
    if (scaleAnimsRef.current[index]) {
      Animated.parallel([
        Animated.spring(scaleAnimsRef.current[index], { toValue: 1, useNativeDriver: true }),
        Animated.timing(darkAnimsRef.current[index], { toValue: 0, duration: 120, useNativeDriver: false }),
      ]).start();
    }
  };
  // ------------------------------------


  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />
          <ScrollView contentContainerStyle={styles.innerScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>{exercise.icon} {exercise.title}</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>กำลังดึงข้อมูลสถานที่...</Text>
              </View>
            ) : isError ? (
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: 'red' }]}>⚠️ เกิดข้อผิดพลาดในการโหลดข้อมูล</Text>
                    <Text style={[styles.loadingText, { fontSize: 14 }]}>โปรดตรวจสอบการตั้งค่า API และ Token</Text>
                </View>
            ) : places.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>ไม่พบสถานที่สำหรับ {exercise.title}</Text>
                </View>
            ) : (
                // แสดงรายการสถานที่เมื่อโหลดเสร็จแล้ว
                places.map((place, index) => (
                    <View key={index} style={styles.placeCard}>
                        <View style={styles.placeInfoRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.placeName}>{place.name}</Text>
                                <Text style={styles.placeTime}>{place.hours}</Text>
                            </View>

                            <Pressable
                                onPressIn={() => handlePressIn(index)}
                                onPressOut={() => handlePressOut(index)}
                                onPress={() => navigation.navigate("Map", { place })}
                                style={styles.routeButtonWrapper}
                            >
                                <Animated.View style={{ transform: [{ scale: scaleAnimsRef.current[index] || 1 }] }}>
                                    <LinearGradient
                                        colors={['#007AFF', '#00BFFF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.routeButtonSmall}
                                    >
                                        <Text style={styles.routeButtonTextSmall}>ดูเส้นทาง</Text>
                                        <Animated.View
                                            style={[
                                                StyleSheet.absoluteFillObject,
                                                { backgroundColor: 'black', opacity: darkAnimsRef.current[index] || 0, borderRadius: 20 },
                                            ]}
                                        />
                                    </LinearGradient>
                                </Animated.View>
                            </Pressable>
                        </View>
                    </View>
                ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </AppBackground>
  );
}

// ... (Styles ส่วนล่างยังคงเดิม) ...
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    height: height * 0.7, 
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    alignSelf: 'flex-start',
    left: 30,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  innerScroll: {
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  placeCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeTime: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  routeButtonWrapper: {
    marginLeft: 10,
  },
  routeButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeButtonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  placeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#555',
  },
});