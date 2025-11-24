import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const banner = require('../../assets/Mascot/event/torch_event.png')

export default function SettingScreen({ navigation }) {

  const [stack, setStack] = useState("food"); // default stack

  // โหลดค่า stack ที่เลือกก่อนหน้า
  useEffect(() => {
    const loadStack = async () => {
      const storedStack = await AsyncStorage.getItem("userStack");
      if (storedStack) setStack(storedStack);
    };
    loadStack();
  }, []);

  // ฟังก์ชันเปลี่ยน stack
  const handleStackChange = async (newStack) => {
    setStack(newStack);
    await AsyncStorage.setItem("userStack", newStack);
    Alert.alert("Success", `Stack changed to ${newStack}`);
  };

     const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        navigation.replace('Login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

     <TouchableOpacity onPress={() => navigation.navigate("EventScreen")}>
  <ImageBackground
    source={banner}
    resizeMode="cover"
    style={styles.eventBackground}
    imageStyle={{ borderRadius: 10 }}
  >
    <LinearGradient
      colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.55)"]}
      style={styles.overlay}
    >
      <Text style={styles.eventText}>Event</Text>
    </LinearGradient>
  </ImageBackground>
</TouchableOpacity>

      {/* Stack Selection */}
      <View style={styles.stackContainer}>
        <Text style={styles.subtitle}>Choose Stack:</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.stackButton, stack === "food" && styles.activeButton]}
            onPress={() => handleStackChange("food")}
          >
            <Text style={styles.buttonText}>Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stackButton, stack === "exercise" && styles.activeButton]}
            onPress={() => handleStackChange("exercise")}
          >
            <Text style={styles.buttonText}>Exercise</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* AboutMe Navigation */}
      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate("AboutMe")}
      >
        <Text style={styles.aboutText}>Go to About Me</Text>
      </TouchableOpacity>

          <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate("StackHistory")}
      >
        <Text style={styles.aboutText}>Stack History</Text>
      </TouchableOpacity>

    <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.aboutText}>Back to Home</Text>
      </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.aboutText}>Logout</Text>
                  </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
    stackContainer: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10},
  subtitle: { fontSize: 18, marginBottom: 10, color: "#8A2BE2", fontWeight: "600" },
  buttonsRow: { flexDirection: "row", gap: 15 },
  stackButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#8f8f8fff",
    alignItems: "center",
  },
  activeButton: { backgroundColor: "#8A2BE2" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  aboutButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: "#d25555ff",
    borderRadius: 10,
    alignItems: "center",
  },
  aboutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
eventBackground: {
  width: "100%",
  height: 110,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 20,
  borderRadius: 10,
  overflow: "hidden",
},

overlay: {
  flex: 1,
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 146, 251, 0.1)",  // ปรับได้
  borderRadius: 10,
},

eventText: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "900",
  textShadowColor: "rgba(0,0,0,0.8)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 5,
},

});
