import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;

  // ✅ นำกลับมา (เหมือนที่คุณมีในเวอร์ชันก่อน)
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

  // ✅ แล้วค่อยใช้
  const places = exercisePlaces[exercise.title] || [];

  // ✅ เก็บ animation แยกตามจำนวนปุ่ม
  const scaleAnims = useRef(places.map(() => new Animated.Value(1))).current;
  const darkAnims = useRef(places.map(() => new Animated.Value(0))).current;

  const handlePressIn = (index) => {
    Animated.parallel([
      Animated.spring(scaleAnims[index], { toValue: 0.97, useNativeDriver: true }),
      Animated.timing(darkAnims[index], { toValue: 0.2, duration: 120, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = (index) => {
    Animated.parallel([
      Animated.spring(scaleAnims[index], { toValue: 1, useNativeDriver: true }),
      Animated.timing(darkAnims[index], { toValue: 0, duration: 120, useNativeDriver: false }),
    ]).start();
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />
          <ScrollView contentContainerStyle={styles.innerScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>{exercise.icon} {exercise.title}</Text>

            {places.map((place, index) => (
              <View key={index} style={styles.placeCard}>
                <View style={styles.placeInfoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeTime}>เปิด {place.open} - ปิด {place.close}</Text>
                  </View>

                  {/* ✅ ส่ง index เข้าไปใน handler */}
                  <Pressable
                    onPressIn={() => handlePressIn(index)}
                    onPressOut={() => handlePressOut(index)}
                    onPress={() => navigation.navigate("Map", { place })}
                    style={styles.routeButtonWrapper}
                  >
                    <Animated.View style={{ transform: [{ scale: scaleAnims[index] }] }}>
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
                            { backgroundColor: 'black', opacity: darkAnims[index], borderRadius: 20 },
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
      </ScrollView>
    </AppBackground>
  );
}


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    height: height * 0.5, // 👈 ปรับจาก 0.5 → 0.7 (เหมือนอีกหน้าหนึ่ง)
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
