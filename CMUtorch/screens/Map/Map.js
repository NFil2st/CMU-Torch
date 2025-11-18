import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppBackground from '../../components/common/AppActionsMascotRun';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';

// 🚨 ในแอปพลิเคชันจริง: ควรใช้ Geolocation API เพื่อดึงตำแหน่งปัจจุบันของผู้ใช้
const mockUserLocation = {
  latitude: 18.78807, // ตำแหน่งสมมติของผู้ใช้
  longitude: 98.95244,
};

const { width, height } = Dimensions.get('window');

// ฟังก์ชันคำนวณระยะทาง Haversine
const calcDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // km
};

export default function Map({ route, navigation }) {
  // 🆕 ดึงข้อมูลสถานที่ (place) ที่ส่งมาจากหน้าจอก่อนหน้า
  const { place } = route.params; 

  const [distance, setDistance] = useState(null);
  const [canStart, setCanStart] = useState(false);

  // 🚨 สมมติฐาน: place object มี latitude และ longitude
  const destination = {
    latitude: place.latitude, 
    longitude: place.longitude,
  };
  
  // ตรวจสอบความถูกต้องของข้อมูล (เผื่อกรณีดึงข้อมูลไม่สมบูรณ์)
  const isDestinationValid = destination.latitude && destination.longitude;

  useEffect(() => {
    if (!isDestinationValid) {
        setDistance("N/A");
        Alert.alert("ข้อผิดพลาด", `ไม่พบพิกัด (Lat/Lon) สำหรับ ${place.name}`);
        return;
    }

    const d = calcDistance(
      mockUserLocation.latitude,
      mockUserLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    
    // แสดงระยะทางเป็นกิโลเมตร ทศนิยม 2 ตำแหน่ง
    const distanceInKm = d.toFixed(2);
    setDistance(distanceInKm);

    // เงื่อนไข: ถ้า <= 2 km สามารถเริ่มได้
    setCanStart(d <= 2); 
  }, [place.latitude, place.longitude]); // ให้คำนวณใหม่เมื่อพิกัดเปลี่ยน

  const handleStart = () => {
    if (!canStart) {
      Alert.alert("ยังอยู่ไกลเกินไป", "ต้องอยู่ในระยะ 2 km จึงสามารถเริ่มได้");
      return;
    }
    // 🚨 ส่งข้อมูลที่จำเป็นไปยังหน้า ExerciseCooldown (ถ้ามี)
    navigation.navigate("ExerciseCooldown");
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />
      <View style={styles.container}>

        <View style={styles.speechBubble}>
        {/* 🆕 แสดงชื่อสถานที่ */}
        <View style={styles.header}>
          <Text style={styles.title}>เส้นทางไปยัง</Text>
          <Text style={styles.title}>{place.name}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.kmNumber}>{distance || "--"}</Text>
          <Text style={styles.kmLabel}>kilometers away</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 จาก: ตำแหน่งผู้ใช้</Text>
          <Text style={styles.infoText}>🎯 ไปยัง: {place.name}</Text>
        </View>

        {canStart && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>เริ่มออกกำลังกาย</Text>
          </TouchableOpacity>
        )}
        {!canStart && distance && isDestinationValid && (
          <Text style={styles.warningText}>อยู่ห่างเกิน 2 km ไม่สามารถเริ่มได้</Text>
        )}
        {!isDestinationValid && (
            <Text style={styles.warningText}>ไม่สามารถคำนวณระยะทางได้เนื่องจากไม่พบพิกัด</Text>
        )}
      </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    height: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'flex-start', // เปลี่ยนเป็น flex-start
  },
  title: {
    fontSize: 24, // ลดขนาดลงเล็กน้อยเพื่อให้พอดีกับชื่อสถานที่ยาวๆ
    fontWeight: "700",
    color: "#3a0066",
    textAlign: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  kmNumber: {
    fontSize: 62,
    fontWeight: "800",
    color: "#3b0069",
  },
  kmLabel: {
    fontSize: 20,
    marginTop: 5,
    color: "#4c0078",
    opacity: 0.7,
  },
  infoBox: {
    borderRadius: 16,
    width: "100%",
  },
  infoText: {
    textAlign: "center",
    fontSize: 15,
    color: "#5c008a",
    marginBottom: 5,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#7f30b0ff",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  warningText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "500",
    color: "#cc0000",
    textAlign: 'center',
  },
});