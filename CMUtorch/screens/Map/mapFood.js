import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from "react-native";
import AppBackground from '../../components/common/AppActionsMascotRun';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

// 🚨 ในแอปพลิเคชันจริง: ควรใช้ Geolocation API เพื่อดึงตำแหน่งปัจจุบันของผู้ใช้
const mockUserLocation = {
  latitude: 18.8575373,
  longitude: 99.0974583,
};

const { width, height } = Dimensions.get('window');

// ฟังก์ชันคำนวณระยะทาง Haversine (เหมือนเดิม)
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

// 🆕 ฟังก์ชันเรียก API และประมวลผล
const fetchAndSelectNearestLocation = async (foodId) => {
    const response = await fetch(`${API_URL}/api/getFoodPlaces?food_id=${foodId}`);
    const data = await response.json();

    if (!data.success || !data.locations || data.locations.length === 0) {
        console.warn("No locations found for this food item.");
        return null; // ไม่มีสถานที่สำหรับอาหารนี้
    }

  let nearestLocation = null;
  let minDistance = Infinity;

  // วนลูปคำนวณระยะทางและค้นหาสถานที่ที่ใกล้ที่สุด
  data.locations.forEach(loc => {
    // คำนวณระยะทาง d จาก mockUserLocation ไปยัง loc
    const d = calcDistance(
      mockUserLocation.latitude,
      mockUserLocation.longitude,
      loc.latitude,
      loc.longitude
    );

    if (d < minDistance) {
      minDistance = d;
      nearestLocation = {
        ...loc,
        distance: d, // เก็บระยะทางไว้ด้วย
      };
    }
  });

  return nearestLocation; // 💡 ส่งกลับสถานที่เดียวที่ใกล้ที่สุด
};

export default function Map({ route, navigation }) {
  const { foodId, foodName } = route.params; 

  const [distance, setDistance] = useState(null);
  const [canStart, setCanStart] = useState(false);
  const [destination, setDestination] = useState(null); // เก็บพิกัดสถานที่ที่ใกล้ที่สุด
  const [destinationName, setDestinationName] = useState('กำลังค้นหาสถานที่...');

  const isDestinationValid = destination?.latitude && destination?.longitude;


  useEffect(() => {
    const loadLocation = async () => {
        // 1. ดึงข้อมูลสถานที่ที่ใกล้ที่สุด
        const nearestLoc = await fetchAndSelectNearestLocation(foodId);

        if (!nearestLoc) {
            setDistance("N/A");
            setDestinationName(`ไม่พบสถานที่สำหรับ ${foodName}`);
            Alert.alert("ข้อผิดพลาด", `ไม่พบสถานที่สำหรับอาหาร: ${foodName}`);
            return;
        }

        // 2. ตั้งค่าสถานที่ปลายทาง
        setDestination({ 
            latitude: nearestLoc.latitude, 
            longitude: nearestLoc.longitude,
        });
        // แสดงชื่อสถานที่จริงที่ใกล้ที่สุด
        setDestinationName(nearestLoc.name); 

        // 3. ตั้งค่าระยะทาง (ใช้ค่าที่คำนวณจากฟังก์ชันข้างบน)
        const distanceInKm = nearestLoc.distance.toFixed(2);
        setDistance(distanceInKm);

        // เงื่อนไข: ถ้า <= 2 km สามารถเริ่มได้
        setCanStart(nearestLoc.distance <= 20); 
    };

    if (foodId) {
        loadLocation();
    } else {
        setDistance("N/A");
        setDestinationName("ไม่พบ Food ID");
    }

  }, [foodId]); // ให้คำนวณใหม่เมื่อ foodId เปลี่ยน

  const handleStart = () => {
    if (!canStart) {
      Alert.alert("ยังอยู่ไกลเกินไป", "ต้องอยู่ในระยะ 500m จึงสามารถเริ่มได้");
      return;
    }
    // ส่ง foodId/foodName ที่จำเป็นไปให้ CameraScreen
    navigation.navigate("CameraScreen", { foodId, foodName });
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.speechBubble}>
        <View style={styles.header}>
          <Text style={styles.title}>เส้นทางไปยัง</Text>
          {/* แสดงชื่อสถานที่ที่ใกล้ที่สุด */}
          <Text style={styles.title}>{destinationName}</Text> 
        </View>
        <View style={styles.card}>
          <Text style={styles.kmNumber}>{distance || "--"}</Text>
          <Text style={styles.kmLabel}>kilometers away</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 จาก: ตำแหน่งผู้ใช้</Text>
          <Text style={styles.infoText}>🎯 ไปยัง: {destinationName}</Text>
        </View>

        {canStart && (
          <TouchableOpacity 
            style={styles.button} // เปลี่ยนสีปุ่มให้ดูพร้อมใช้งาน
            onPress={handleStart}
          >
            <Text style={styles.buttonText}>เริ่มสแกนอาหาร</Text>
          </TouchableOpacity>
        )}
        {!canStart && distance && isDestinationValid && (
          <Text style={styles.warningText}>อยู่ห่างเกิน 500 m ไม่สามารถเริ่มได้</Text>
        )}
        {!isDestinationValid && distance === 'N/A' && (
            <Text style={styles.warningText}>ไม่สามารถคำนวณระยะทางได้หรือไม่มีสถานที่</Text>
        )}
      </View>
      </ScrollView>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end', 
        paddingBottom: 20,
    },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    height: height * 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'flex-start', // เปลี่ยนเป็น flex-start
  },
  title: {
    fontSize: 20, // ลดขนาดลงเล็กน้อยเพื่อให้พอดีกับชื่อสถานที่ยาวๆ
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
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
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