import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const mascotImages = {
  orange:require("../../assets/Mascot/orange/eyeheart/torch_orange_heart.png"),
  red:require("../../assets/Mascot/red/eyeheart/torch_red_heart.png"),
  blue:require("../../assets/Mascot/blue/eyeheart/torch_blue_heart.png"),
  purple:require("../../assets/Mascot/purple/eyeheart/torch_purple_heart.png")
};

const colorFromScore = (score) => {
  if (score == null || score < 10) return "orange";
  if (score < 30) return "red";
  if (score < 60) return "blue";
  return "purple";
};

export default function AppActionsMascotRun({ children }) {
  const [defaultColor, setDefaultColor] = useState(null);
  const bounceAnim = useRef(new Animated.Value(0)).current;

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

useEffect(() => {
  const fetchMood = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      // 🔹 load stack from AsyncStorage
      const userStack = (await AsyncStorage.getItem("userStack")) || "food";
      const endpoint =
        userStack === "exercise" ? "/api/getMoodExercise" : "/api/getMoodFood";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(`🔹 API ${endpoint} response:`, data);

      if (data.success && data.data) {
        const stackScore = parseInt(data.data.stack, 10) || 0;

        setDefaultColor(colorFromScore(stackScore));
      } else {
        setDefaultColor("orange");
      }
    } catch (err) {
      console.error("Failed to fetch mood:", err);
      setDefaultColor("orange");
    }
  };

  fetchMood();
}, []);


  console.log("🔹 defaultColor:", defaultColor);

  if (defaultColor === null) {
    return <View style={styles.container}>{children}</View>;
  }

  const mascotImage = mascotImages[defaultColor];

  if (!mascotImage) {
    console.warn(
      `🔸 Mascot image not found for color=${defaultColor}, mood=${defaultMood}`
    );
  }

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