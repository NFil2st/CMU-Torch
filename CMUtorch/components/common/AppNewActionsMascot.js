import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const mascotImages = {
  orange: {
    run: require("../../assets/Mascot/orange/run/torch_orange_run.png"),
    takephoto: require("../../assets/Mascot/orange/good/torch_orange_good.png"),
    eyeheart: require("../../assets/Mascot/orange/happy/torch_orange_happy.png"),
  },
  red: {
    run: require("../../assets/Mascot/red/run/torch_red_run.png"),
    takephoto: require("../../assets/Mascot/red/good/torch_red_good.png"),
    eyeheart: require("../../assets/Mascot/red/happy/torch_red_happy.png"),
  },
  blue: {
    run: require("../../assets/Mascot/blue/run/torch_blue_run.png"),
    takephoto: require("../../assets/Mascot/blue/good/torch_blue_good.png"),
    eyeheart: require("../../assets/Mascot/blue/happy/torch_blue_happy.png"),
  },
  purple: {
    run: require("../../assets/Mascot/purple/run/torch_purple_run.png"),
    takephoto: require("../../assets/Mascot/purple/good/torch_purple_good.png"),
    eyeheart: require("../../assets/Mascot/purple/happy/torch_purple_happy.png"),
  },
};

const colorFromScore = (score) => {
  if (score == null || score < 10) return "orange";
  if (score < 30) return "red";
  if (score < 60) return "blue";
  return "purple";
};

const moodFromScore = (score) => {
  if (score == null || score <= 2.5) return "sad";
  if (score > 2.5 && score < 4) return "good";  // <=4 ไม่รวม
  if (score >= 4) return "happy";
  return "good";
};


export default function AppBackgroundWithMascot({ children }) {
  const [defaultColor, setDefaultColor] = useState(null);
  const [defaultMood, setDefaultMood] = useState(null);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // 🔹 bounce animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bounceAnim]);

  // 🔹 fetch user score from API
useEffect(() => {
  const fetchMood = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // ตัว token ที่ login ได้มา
if (!token) {
  console.log("No token found");
  return;
}

const res = await fetch(`${API_URL}/api/getMood`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`  // ต้องมีคำว่า Bearer
  }
});

const data = await res.json();
console.log(data);
      console.log("🔹 API getMood response:", data);

      if (data.success && data.data) {
        const stackScore = parseInt(data.data.stack, 10) || 0;
        const moodScore = parseFloat(data.data.mood) || 0;

        setDefaultColor(colorFromScore(stackScore));
        setDefaultMood(moodFromScore(moodScore));
      } else {
        // fallback
        setDefaultColor("orange");
        setDefaultMood("happy");
      }
    } catch (err) {
      console.error("Failed to fetch mood:", err);
      setDefaultColor("orange");
      setDefaultMood("happy");
    }
  };
  fetchMood();
}, []);


  // 🔹 debug before render
  console.log("🔹 defaultColor:", defaultColor, "defaultMood:", defaultMood);

  if (defaultColor === null || defaultMood === null) {
    return <View style={styles.container}>{children}</View>;
  }

  // 🔹 เลือกรูป mascot
  const mascotImage = mascotImages[defaultColor]?.[defaultMood];

  // 🔹 ถ้า path ไม่เจอ แสดง log
  if (!mascotImage) {
    console.warn(
      `🔸 Mascot image not found for color=${defaultColor}, mood=${defaultMood}`
    );
  }

  // 🔹 animation
  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const tilt = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-2deg", "2deg", "-2deg"],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#A6A7FF", "#C490D1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {mascotImage && (
        <Animated.Image
          source={mascotImage}
          style={[styles.mascotBg, { transform: [{ translateY }, { rotate: tilt }] }]}
          resizeMode="contain"
          pointerEvents="none"
        />
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  mascotBg: {
    position: "absolute",
    top: -100,
    width: "135%",
    height: "100%",
    alignSelf: "center",
    zIndex: 1,
    opacity: 0.95,
  },
  content: { flex: 1, zIndex: 2 },
});