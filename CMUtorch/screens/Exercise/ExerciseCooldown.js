import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import StackColorPopup from '../../components/common/StackColorPopup';
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const colorFromStack = (stack) => {
  if (stack == null || stack < 10) return "orange";
  if (stack < 30) return "red";
  if (stack < 60) return "blue";
  return "purple";
};


export default function ExerciseCooldown({ navigation }) {
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);
  const [stack, setStack] = useState(null);
  const [oldStack, setOldStack] = useState(null);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);


  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const startTimer = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const animateStack = () => {
    animatedValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const completeExercise = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/completeExercise`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setOldStack(data.stackExercise - 1); // ให้โชว์ stack เก่า
        setStack(data.stackExercise);        // stack ใหม่

        animateStack();                       // run animation
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Animation config
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0], // เด้งขึ้น
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // ค่อยๆ โผล่
  });

const [popupVisible, setPopupVisible] = useState(false);

// เรียกหลัง stack ใหม่ได้แล้ว
useEffect(() => {
  const showOncePerColor = async () => {
    if (stack === null) return;

    const colorKey = colorFromStack(stack); // orange, red, blue, purple
    const storageKey = `stackPopupShown_${colorKey}`; // สร้าง key ตามสี
    const shown = await AsyncStorage.getItem(storageKey);

    // แสดง popup ถ้ายังไม่เคยโชว์สำหรับสีนี้
    if ([1, 10, 30, 60].includes(stack) && !shown) {
      setPopupVisible(true);
      await AsyncStorage.setItem(storageKey, "true");
    }
  };

  showOncePerColor();
}, [stack]);

  return (
    <AppBackground>
              <BackButton navigation={navigation} />
              <StackColorPopup
  stack={stack}
  visible={popupVisible}
  onClose={() => setPopupVisible(false)}
/>

    <View style={styles.container}>
      <Text style={styles.title}>Cooldown</Text>
      <Text style={styles.timer}>{seconds}s</Text>

      {!running && seconds !== 0 && (
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>เริ่ม</Text>
        </TouchableOpacity>
      )}
      {stack !== null && (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={styles.stackLabel}>StackExercise</Text>

          {/* old number (แสดงก่อน animation) */}
          <Text style={styles.stackOld}>{oldStack}</Text>

          {/* animated new number */}
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
            onPress={() => handleNavigate('Home')}
          >
            <Text style={styles.homeButtonText}>กลับหน้า Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // ฉากมืดให้เลขขาวเด่น
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "white",
  },
  timer: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  stackLabel: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },

  stackOld: {
    color: "white",
    fontSize: 32,
    opacity: 0.4,
    marginBottom: -5,
  },

  stackNew: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
   homeButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#6C63FF",
    borderRadius: 12,
  },
  homeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
