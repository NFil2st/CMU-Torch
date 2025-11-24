import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import AppBackground from "../../components/common/AppBackground";
import BackButton from "../../components/common/BackButton";

const { width, height } = Dimensions.get("window");

export default function AboutScreen ({ navigation }) {
  return (
    <AppBackground>
      <BackButton navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>About Us</Text>

        {/* Card: Mission */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            เราตั้งใจพัฒนาแพลตฟอร์มเพื่อช่วยให้นักศึกษาเข้าใจอารมณ์ สุขภาพ และพฤติกรรมของตัวเองได้ดีขึ้น 
            ผ่านการติดตามในชีวิตประจำวัน เพื่อให้ทุกคนมีความสุขและคุณภาพชีวิตที่ดีขึ้น 💜
          </Text>
        </View>

        {/* Card: What We Do */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Do</Text>
          <Text style={styles.cardText}>
            • ติดตามอารมณ์และกิจกรรมแต่ละวัน{"\n"}
            • แนะนำอาหาร ออกกำลังกาย และ mental care{"\n"}
            • วิเคราะห์ข้อมูลเพื่อส่งเสริมสุขภาพที่เหมาะกับแต่ละคน{"\n"}
            • สนับสนุนการดูแลตัวเองอย่างยั่งยืน 🔥
          </Text>
        </View>

        {/* Card: Team */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Team</Text>
          <Text style={styles.cardText}>
            ทีมพัฒนานักศึกษาผู้มุ่งมั่นสร้างแพลตฟอร์มที่ช่วยให้ทุกคนมีชีวิตประจำวันที่ดีขึ้น  
            ด้วยความใส่ใจ UX และข้อมูลที่เข้าใจง่าย 🫶
          </Text>
        </View>

      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  mascot: {
    width: width * 0.5,
    height: height * 0.25,
    marginTop: 20,
  },
  title: {
    paddingTop: 100,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#3a0066",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // Shadow (Android)
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  cardText: {
    color: "#3a0066",
    fontSize: 15,
    lineHeight: 22,
  },
});
