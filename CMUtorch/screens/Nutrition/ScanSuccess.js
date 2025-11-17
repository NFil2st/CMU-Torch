import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;



export default function ScanSuccess({ route, navigation }) {
  const { data } = route.params;
  const predictions = data?.predictions || [];

  const foodMessages = {
    drinks: "ดื่มน้ำให้สดชื่นหน่อยน้าา 💧",
    steaks: "สเต๊กเนื้อฉ่ำ ๆ ได้พลังสุดๆ! 🥩",
    shrimp: "กุ้งสดเด้งๆ เติมโปรตีนแบบจุกๆ 🦐",
    eggs: "ไข่เต็มไปด้วยโปรตีนเลยนะ 🍳",
    chickens: "ไก่ล่ะสุดยอดโปรตีนลีนๆ 🐔",
    salmon: "แซลมอนโอเมก้า 3 ล้นๆ บำรุงสมองเลยน้า 🐟",
    porks: "หมูให้พลังงานดีมากเลยนะ 🐷",
    noodles: "เติมคาร์บแบบอร่อย ๆ ด้วยเส้น 🍜",
    rice: "ข้าวอุ่น ๆ เติมพลังงานเต็มที่ 🍚",
    creams: "ครีมหวาน ๆ ละมุนมากก 🍦",
    desserts: "ขนมหอมหวาน เติมน้ำตาลให้เต็มที่เลยย 🍰",
    breads: "ขนมปังกรอบนุ่ม กินแล้วอิ่มนาน 🥖",
  };

  const grouped = predictions.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  // StackFood state
  const [stack, setStack] = useState(null);
  const [oldStack, setOldStack] = useState(null);

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

  // เปลี่ยนชื่อเป็น completeFood
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
        setOldStack(data.stackFood - 1);
        setStack(data.stackFood);
        animateStack();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // เรียก completeFood ตอน component mount
  useEffect(() => {
    completeFood();
  }, []);

  return (
        <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />
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
