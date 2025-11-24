import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
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
  const [seconds, setSeconds] = useState(5);
  const [running, setRunning] = useState(false);
  const [stack, setStack] = useState(null);
  const [oldStack, setOldStack] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  const startTimer = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
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
    Animated.timing(animatedValue, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const completeExercise = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token sent to server:", token);
      if (!token) {
        alert("Token missing! Please login again.");
        return;
      }

      const res = await fetch(`${API_URL}/api/completeExercise`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (data.success) {
        setOldStack(data.stackExercise - 1);
        setStack(data.stackExercise);
        animateStack();
      }
    } catch (err) {
      console.error(err);
      alert("Error completing exercise");
    }
  };

  // Animation
  const translateY = animatedValue.interpolate({ inputRange:[0,1], outputRange:[20,0] });
  const opacity = animatedValue.interpolate({ inputRange:[0,1], outputRange:[0,1] });

  // Show popup per color once
  useEffect(() => {
    const showOncePerColor = async () => {
      if (stack === null) return;
      const colorKey = colorFromStack(stack);
      const storageKey = `stackPopupShown_${colorKey}`;
      const shown = await AsyncStorage.getItem(storageKey);
      if ([1,10,30,60].includes(stack) && !shown) {
        setPopupVisible(true);
        await AsyncStorage.setItem(storageKey, "true");
      }
    };
    showOncePerColor();
  }, [stack]);

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <StackColorPopup stack={stack} visible={popupVisible} onClose={() => setPopupVisible(false)} />
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
            <Text style={styles.stackOld}>{oldStack}</Text>
            <Animated.Text style={[styles.stackNew, { opacity, transform:[{translateY}] }]}>{stack}</Animated.Text>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.homeButtonText}>กลับหน้า Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", alignItems:"center" },
  title: { fontSize:26, fontWeight:"700", marginBottom:10, color:"white" },
  timer: { fontSize:60, fontWeight:"bold", marginBottom:20, color:"white" },
  button: { backgroundColor:"#6C63FF", paddingHorizontal:40, paddingVertical:15, borderRadius:10 },
  buttonText: { color:"#fff", fontSize:20, fontWeight:"700" },
  stackLabel: { color:"white", fontSize:18, marginBottom:5 },
  stackOld: { color:"white", fontSize:32, opacity:0.4, marginBottom:-5 },
  stackNew: { color:"white", fontSize:48, fontWeight:"bold" },
  homeButton: { marginTop:30, paddingVertical:12, paddingHorizontal:30, backgroundColor:"#6C63FF", borderRadius:12 },
  homeButtonText: { color:"white", fontSize:18, fontWeight:"700" },
});
