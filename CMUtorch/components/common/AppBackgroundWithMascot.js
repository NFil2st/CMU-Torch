import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// แผนที่รูป mascot ล่วงหน้า
const mascotImages = {
  orange: {
    sad: require("../../assets/Mascot/orange/sad/torch_orange_sad.png"),
    good: require("../../assets/Mascot/orange/good/torch_orange_good.png"),
    happy: require("../../assets/Mascot/orange/happy/torch_orange_happy.png"),
  },
  red: {
    sad: require("../../assets/Mascot/red/sad/torch_red_sad.png"),
    good: require("../../assets/Mascot/red/good/torch_red_good.png"),
    happy: require("../../assets/Mascot/red/happy/torch_red_happy.png"),
  },
  blue: {
    sad: require("../../assets/Mascot/blue/sad/torch_blue_sad.png"),
    good: require("../../assets/Mascot/blue/good/torch_blue_good.png"),
    happy: require("../../assets/Mascot/blue/happy/torch_blue_happy.png"),
  },
  purple: {
    sad: require("../../assets/Mascot/purple/sad/torch_purple_sad.png"),
    good: require("../../assets/Mascot/purple/good/torch_purple_good.png"),
    happy: require("../../assets/Mascot/purple/happy/torch_purple_happy.png"),
  },
};

// แปลง score → color
const colorFromScore = (score) => {
  if (score == null || score <= 10) return "orange";
  if (score <= 30) return "red";
  if (score <= 60) return "blue";
  return "purple";
};

// แปลง score → mood
const moodFromScore = (score) => {
  if (score == null || score <= 0) return "sad";
  if (score === 1) return "sad";
  if (score === 2 || score === 3) return "good";
  if (score >= 4) return "happy";
  return "good";
};

export default function AppBackgroundWithMascot({ children, emotion }) {
  const [defaultColor, setDefaultColor] = useState("null");
  const [defaultMood, setDefaultMood] = useState("null");

  const bounceAnim = useRef(new Animated.Value(0)).current;

  // bounce animation
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

  // fetch user score
  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const res = await fetch("http://10.122.2.193:3000/api/getMood", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.data) {
  const stackScore = parseInt(data.data.stack, 10); // "11" → 11
  const moodScore = parseInt(data.data.mood, 10);   // "5" → 5

  const color = colorFromScore(stackScore);
  const mood = moodFromScore(moodScore);

  setDefaultColor(color);
  setDefaultMood(mood);
}
      } catch (err) {
        console.error("Failed to fetch user score:", err);
      }
    };

    fetchUserScore();
  }, []);

   if (!defaultColor || !defaultMood) {
    return <View style={styles.container}>{children}</View>;
  }
  // เลือกรูป mascot
  const mascotImage =
    mascotImages[defaultColor]?.[defaultMood]

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

      <Animated.Image
        source={mascotImage}
        style={[styles.mascotBg, { transform: [{ translateY }, { rotate: tilt }] }]}
        resizeMode="contain"
        pointerEvents="none"
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
mascotBg: {
  position: "absolute",
  top: -100,          // ย้ายขึ้นนิดหน่อย
  width: "135%",    // ขยายเต็มหน้าจอ
  height: "100%",    // สูงขึ้น
  alignSelf: "center",
  zIndex: 1,
  opacity: 0.95,
},
  content: { flex: 1, zIndex: 2 },
});
