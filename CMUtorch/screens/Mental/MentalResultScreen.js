import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import AppBackgroundWithMascot from "../../components/common/AppActionsMascotHeart";
import BackButton from "../../components/common/BackButton";
import NavBar from "../../components/common/NavBar";

const { width, height } = Dimensions.get("window");

export default function MentalResultScreen({ route, navigation }) {
  const { score, totalQuestions } = route.params;

  const avg = score / totalQuestions;

  const getStatus = () => {
    if (avg <= 1.5) {
      return { label: "คุณอาจรู้สึกไม่ค่อยดี", color: "#ff6b6b", desc: "ลองพักผ่อนหรือคุยกับใครสักคนดูนะ" };
    }
    if (avg <= 2.3) {
      return { label: "วันนี้โอเคอยู่", color: "#ffa84b", desc: "รักษาความรู้สึกนี้ไว้ล่ะ!" };
    }
    return { label: "คุณดูแฮปปี้มาก!", color: "#4cd964", desc: "เยี่ยมไปเลย! ขอให้เป็นแบบนี้ทุกวัน" };
  };

  const status = getStatus();

  return (
    <AppBackgroundWithMascot>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <View style={styles.container}>
        
        <Text style={styles.title}>ผลประเมินความรู้สึกของคุณ</Text>

        <View style={[styles.scoreBox, { borderColor: status.color }]}>
          <Text style={[styles.scoreText, { color: status.color }]}>
            {score} / {totalQuestions * 3}
          </Text>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
          <Text style={styles.desc}>{status.desc}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")} // เปลี่ยนตามชื่อหน้า home
        >
          <Text style={styles.buttonText}>กลับหน้าหลัก</Text>
        </TouchableOpacity>

      </View>
    </AppBackgroundWithMascot>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: width - 40,
    height: '50%',
    marginTop: height * 0.5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    padding: 30,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  scoreBox: {
    borderWidth: 3,
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    width: "80%",
  },
  button: {
    backgroundColor: "#7a3586ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
