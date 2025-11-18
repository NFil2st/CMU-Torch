import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function settingScreen({ navigation }) {
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
        onPress={() => navigation.navigate("DailyLogWidget")}
      >
        <Text style={styles.aboutText}>Go to Widget</Text>
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
});
