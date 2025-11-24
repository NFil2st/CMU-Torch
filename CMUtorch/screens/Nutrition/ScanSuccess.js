import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';
import StackColorPopup from '../../components/common/StackColorPopup';
import Constants from "expo-constants";

// ดึง API_URL จาก Constants
const API_URL = Constants.expoConfig.extra.apiUrl;

// ฟังก์ชันกำหนดสีจาก StackFood
const colorFromStack = (stack) => {
  if (stack == null || stack < 10) return "orange";
  if (stack < 30) return "red";
  if (stack < 60) return "blue";
  return "purple";
};


export default function ScanSuccess({ route, navigation }) {
  const { data } = route.params;

  // --- ส่วนที่แก้ไข: ดึง Array ของชื่อคลาส (String) มาใช้โดยตรง ---
  // เนื่องจาก API Endpoint ส่ง predictions: ["Desserts", "Drinks"] มาให้แล้ว
  const predictions = data?.predictions || []; 
  // ---

  console.log("Predictions:", predictions); // ควรแสดง ["Desserts", "Drinks"] หรือชื่อคลาสที่พบ

  const foodMessages = {
    "Drinks": "ดื่มน้ำให้สดชื่นหน่อยน้าา 💧",
    "Food-Steaks": "สเต๊กเนื้อฉ่ำ ๆ ได้พลังสุดๆ! 🥩",
    "Food-Noodle Dishes": "เติมคาร์บแบบอร่อย ๆ ด้วยเส้น 🍜",
    "Food-Rice Dishes": "ข้าวอุ่น ๆ เติมพลังงานเต็มที่ 🍚",
    "Desserts": "ขนมหอมหวาน เติมน้ำตาลให้เต็มที่เลยย 🍰",
  };


  // จัดกลุ่มอาหารที่พบ (นับจำนวนซ้ำ)
  const grouped = predictions.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  // StackFood state
  const [stack, setStack] = useState(null);
  const [oldStack, setOldStack] = useState(null);

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const animateStack = () => {
    opacity.setValue(0);
    translateY.setValue(-20);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  // เรียก API เพื่ออัปเดต StackFood
  const completeFood = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/completeFood`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        // กำหนด stack เก่าและใหม่ และเริ่ม animation
        setOldStack(data.stackFood - 1);
        setStack(data.stackFood);
        animateStack();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [popupVisible, setPopupVisible] = useState(false);

  // Logic สำหรับแสดง Popup เมื่อถึง stack สีใหม่
  useEffect(() => {
    const showOncePerColor = async () => {
      if (stack === null) return;

      const colorKey = colorFromStack(stack); // orange, red, blue, purple
      const storageKey = `stackPopupShown_${colorKey}`; // สร้าง key ตามสี
      const shown = await AsyncStorage.getItem(storageKey);

      // แสดง popup ถ้าเป็น stack แรกของสีนั้น ๆ และยังไม่เคยโชว์
      if ([1, 10, 30, 60].includes(stack) && !shown) {
        setPopupVisible(true);
        await AsyncStorage.setItem(storageKey, "true");
      }
    };

    showOncePerColor();
  }, [stack]);

  // เรียก completeFood ตอน component mount
  useEffect(() => {
    completeFood();
  }, []);

  return (
    <AppBackground>
      <NavBar navigation={navigation} />
      <StackColorPopup
        stack={stack}
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />

      <View style={styles.container}>
        <Text style={styles.title}>ผลลัพธ์การสแกนอาหาร 🍽️</Text>

        <View style={styles.bubble}>
          {predictions.length > 0 ? (
            Object.keys(grouped).map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <Text style={styles.foodName}>
                  {item} {grouped[item] > 1 ? `x${grouped[item]}` : ""}
                </Text>
                <Text style={styles.foodMsg}>{foodMessages[item]}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noFood}>ไม่พบอาหาร 😢</Text>
          )}
        </View>

        {/* StackFood Section */}
        {stack !== null && (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={styles.stackLabel}>StackFood</Text>

            <Text style={styles.stackOld}>{oldStack}</Text>

            <Animated.Text
              style={[
                styles.stackNew,
                { opacity: opacity, transform: [{ translateY }] },
              ]}
            >
              {stack}
            </Animated.Text>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.homeButtonText}>กลับหน้า Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AppBackground>
  );
}

// Styles เหมือนเดิม
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#ffffffff" },
  bubble: { backgroundColor: "white", padding: 20, borderRadius: 20, width: "100%", minHeight: 100, borderWidth: 1, borderColor: "#ddd", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  foodItem: { marginBottom: 18 },
  foodName: { fontSize: 20, fontWeight: "bold", color: "#6C63FF" },
  foodMsg: { fontSize: 16, marginTop: 4, color: "#6C63FF" },
  noFood: { fontSize: 18, textAlign: "center", color: "#999" },
  stackLabel: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#ffffffff" },
  stackOld: { fontSize: 36, color: "#e4e4e4ff" },
  stackNew: { fontSize: 48, fontWeight: "bold", color: "#6C63FF" },
  homeButton: { backgroundColor: "#6C63FF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 15, marginTop: 30 },
  homeButtonText: { fontSize: 18, fontWeight: "bold", color: "white" },
});