import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: กรอกอีเมล, 2: OTP, 3: username/password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: ส่ง OTP ไปเมล CMU
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("ผิดพลาด", "กรุณากรอกอีเมล CMU");
      return;
    }
    try {
      const res = await axios.post("http://10.0.2.2:3000/api/send-otp", { email });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "ส่ง OTP ไปที่อีเมลแล้ว");
        setStep(2);
      } else {
        Alert.alert("ผิดพลาด", res.data.message || "ไม่สามารถส่ง OTP ได้");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดขณะส่ง OTP");
    }
  };

  // Step 2: ตรวจสอบ OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("ผิดพลาด", "กรุณากรอก OTP");
      return;
    }
    try {
      const res = await axios.post("http://10.0.2.2:3000/api/verify-otp", { email, otp });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "OTP ถูกต้อง");
        setStep(3);
      } else {
        Alert.alert("ผิดพลาด", res.data.message || "OTP ไม่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดขณะตรวจสอบ OTP");
    }
  };

  // Step 3: สมัครบัญชี
  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("ผิดพลาด", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("ผิดพลาด", "รหัสผ่านไม่ตรงกัน");
      return;
    }
    try {
      const res = await axios.post("http://10.0.2.2:3000/api/register", {
        email,
        username,
        password,
      });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "สมัครบัญชีเรียบร้อย");
        navigation.replace("Login");
      } else {
        Alert.alert("ผิดพลาด", res.data.message || "สมัครบัญชีไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดขณะสมัคร");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สมัครบัญชี CMU</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="อีเมล CMU"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>ส่ง OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="กรอก OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>ยืนยัน OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>สมัครบัญชี</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#4AD1A9", textAlign: "center" }}>กลับไปหน้า Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#A66DBB",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4AD1A9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4AD1A9",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

