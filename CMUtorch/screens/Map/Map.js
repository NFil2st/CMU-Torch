import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';

const mockUserLocation = {
  latitude: 18.78807,
  longitude: 98.95244,
};

const destination = {
  latitude: 18.79808031685481,
  longitude: 98.95189633716744,
};

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

export default function Map({ navigation }) {
  const [distance, setDistance] = useState(null);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    const d = calcDistance(
      mockUserLocation.latitude,
      mockUserLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    setDistance(d.toFixed(2));
    setCanStart(d <= 2); // ถ้า <=2 km สามารถเริ่มได้
  }, []);

  const handleStart = () => {
    if (!canStart) {
      Alert.alert("ยังอยู่ไกลเกินไป", "ต้องอยู่ในระยะ 2 km จึงสามารถเริ่มได้");
      return;
    }
    navigation.navigate("ExerciseCooldown");
  };

  return (
        <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />
    <View style={styles.container}>
      <Text style={styles.header}>📍 ระยะทาง</Text>

      <LinearGradient colors={["#f7e1ff", "#e9d1ff", "#d7b3ff"]} style={styles.card}>
        <Text style={styles.kmNumber}>{distance ? distance : "--"}</Text>
        <Text style={styles.kmLabel}>kilometers away</Text>
      </LinearGradient>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🧭 จากตำแหน่งปัจจุบัน</Text>
        <Text style={styles.infoText}>🎯 ไปยังจุดหมาย</Text>
      </View>

      {canStart && (
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>เริ่มออกกำลังกาย</Text>
        </TouchableOpacity>
      )}
      {!canStart && distance && (
        <Text style={styles.warningText}>อยู่ห่างเกิน 2 km ไม่สามารถเริ่มได้</Text>
      )}
    </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 30,
    color: "#3a0066",
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
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
    marginTop: 30,
    padding: 15,
    backgroundColor: "#faf5ff",
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
  },
});
