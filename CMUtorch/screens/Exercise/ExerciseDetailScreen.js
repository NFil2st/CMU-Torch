import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';


const { width, height } = Dimensions.get('window');

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;

  const exercisePlaces = {
    'บาสเกตบอล': [
      { name: 'สนามบาสกลางแจ้ง', open: '06:00', close: '21:00' },
      { name: 'ยิมในร่ม', open: '08:00', close: '22:00' },
      { name: 'พื้นที่ซ้อมชู้ตเดี่ยว', open: '07:00', close: '19:00' },
    ],
    'ฟุตบอล': [
      { name: 'สนามฟุตบอลใหญ่', open: '07:00', close: '20:30' },
      { name: 'สนามฟุตซอลในร่ม', open: '08:00', close: '21:00' },
    ],
    'วอลเล่บอล': [
      { name: 'สนามวอลเล่ย์ชายหาด', open: '06:00', close: '19:00' },
      { name: 'ยิมในร่ม', open: '08:00', close: '21:00' },
    ],
    'ว่ายน้ำ': [
      { name: 'สระว่ายน้ำมาตรฐาน', open: '09:00', close: '18:00' },
      { name: 'สระฝึกซ้อม', open: '07:00', close: '17:00' },
    ],
    'วิ่ง': [
      { name: 'สวนสาธารณะ', open: '05:00', close: '22:00' },
      { name: 'ลู่วิ่งในยิม', open: '06:00', close: '21:00' },
    ],
    'จักรยาน': [
      { name: 'ลู่วิ่งจักรยานรอบมหาวิทยาลัย', open: '05:30', close: '19:00' },
      { name: 'ฟิตเนส (Spin Class)', open: '08:00', close: '21:00' },
    ],
    'โยคะ': [
      { name: 'สตูดิโอโยคะ', open: '07:00', close: '20:00' },
      { name: 'สวนกลางแจ้ง', open: '06:00', close: '18:30' },
    ],
    'ฟิตเนส': [
      { name: 'ห้องฟิตเนสกลาง', open: '06:00', close: '22:00' },
      { name: 'ห้องเวทเทรนนิ่ง', open: '08:00', close: '21:00' },
    ],
  };

  const places = exercisePlaces[exercise.title] || [];

  // ✅ Animation (เหมือน Card)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const darkAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }),
      Animated.timing(darkAnim, { toValue: 0.2, duration: 120, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(darkAnim, { toValue: 0, duration: 120, useNativeDriver: false }),
    ]).start();
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />

      {/* Header */}
      <View style={styles.header}>
      </View>

      {/* กล่องขาว */}
      <View style={styles.speechBubble}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>{exercise.icon} {exercise.title}</Text>

          {places.map((place, index) => (
  <View key={index} style={styles.placeCard}>
    <View style={styles.placeInfoRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeTime}>เปิด {place.open} - ปิด {place.close}</Text>
      </View>

      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.routeButtonWrapper}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
                { backgroundColor: 'black', opacity: darkAnim, borderRadius: 20 },
              ]}
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  </View>
))}


        </ScrollView>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  speechBubble: {
    height: height * 0.5,
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
    flex: 1,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
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
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  routeButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
});
