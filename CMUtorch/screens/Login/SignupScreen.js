import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function SignupScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("https://your-server.com/api/send-otp", { email });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "ส่ง OTP ไปที่อีเมลแล้ว");
        setStep(2);
      } else {
        Alert.alert("ผิดพลาด", "ไม่สามารถส่ง OTP ได้");
      }
    } catch (err) {
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดขณะส่ง OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("https://your-server.com/api/verify-otp", { email, otp });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "OTP ถูกต้อง");
        setStep(3);
      } else {
        Alert.alert("ผิดพลาด", "OTP ไม่ถูกต้อง");
      }
    } catch (err) {
      Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดขณะตรวจสอบ OTP");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("ผิดพลาด", "รหัสผ่านไม่ตรงกัน");
      return;
    }
    try {
      const res = await axios.post("https://your-server.com/api/register", {
        email,
        username,
        password,
      });
      if (res.data.success) {
        Alert.alert("สำเร็จ", "สมัครบัญชีสำเร็จ");
        setStep(1);
        setEmail(""); setOtp(""); setUsername(""); setPassword(""); setConfirmPassword("");
      } else {
        Alert.alert("ผิดพลาด", "สมัครบัญชีไม่สำเร็จ");
      }
    } catch (err) {
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
          <Button title="ส่ง OTP" onPress={handleSendOtp} />
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
          <Button title="ยืนยัน OTP" onPress={handleVerifyOtp} />
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
          <Button title="สมัครบัญชี" onPress={handleRegister} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
