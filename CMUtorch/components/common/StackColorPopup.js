import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, Image, Pressable, Animated, Easing } from "react-native";
// 🌟 นำเข้า LinearGradient จากไลบรารีที่เหมาะสม
import { LinearGradient } from "expo-linear-gradient";
// หากใช้ react-native-linear-gradient ให้เปลี่ยนเป็น: 
// import LinearGradient from "react-native-linear-gradient";

// 🎨 ข้อมูลสีและพื้นหลังสำหรับการไล่เฉดสี
const colorData = {
  orange: {
    // สีไล่เฉด (top to bottom) ใกล้เคียงกับรูปภาพ
    gradient: ["#FF8C6B", "#FF4C8D"], 
    text: "START",
  },
  red: {
    gradient: ["#FF3535", "#470A63"], 
    text: "STACK",
  },
  blue: {
    gradient: ["#35F8FF", "#630A3B"], 
    text: "STACK",
  },
  purple: {
    gradient: ["#BE53FB", "#4D8C8C"], 
    text: "STACK",
  },
};

const mascotImages = {
  orange: require("../../assets/Mascot/orange/happy/torch_orange_happy.png"),
  red: require("../../assets/Mascot/red/happy/torch_red_happy.png"),
  blue: require("../../assets/Mascot/blue/happy/torch_blue_happy.png"),
  purple: require("../../assets/Mascot/purple/happy/torch_purple_happy.png"),
};

// ฟังก์ชันเลือกสีจาก stack
const colorFromStack = (stack) => {
  if (stack == null || stack < 10) return "orange";
  if (stack < 30) return "red";
  if (stack < 60) return "blue";
  return "purple";
};

// 💡 Component ใหม่สำหรับข้อความ 2 ส่วนในบรรทัดเดียว
const StackText = ({ value, label, colorKey }) => {
    const textColor = colorKey === 'orange' ? '#5E203B' : '#FFFFFF';
    
    return (
        <View style={styles.stackTextContainer}>
            <Text style={[styles.stackNumber, { color: textColor }]}>
                {value}
            </Text>
            {label !== 'START' && ( 
                <Text style={[styles.stackLabel, { color: textColor }]}>
                    {label}
                </Text>
            )}
        </View>
    );
};


export default function StackColorPopup({ stack, visible, onClose }) {
  const fadeAnim = useState(new Animated.Value(0))[0];

  const colorKey = colorFromStack(stack);
  const data = colorData[colorKey];
  const mascotSource = mascotImages[colorKey];

  const displayStackValue = stack == null || stack < 10 ? data.text : stack;
  const displayStackLabel = stack == null || stack < 10 ? "" : data.text;
  const isStart = stack == null || stack < 10;

  // animation sync กับ visible
  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.fullScreenOverlay} onPress={onClose}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={data.gradient}
            style={styles.gradientBackground}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
            {isStart ? (
              <Text style={[styles.stackNumber, styles.startText]}>{data.text}</Text>
            ) : (
              <StackText value={displayStackValue} label={displayStackLabel} colorKey={colorKey} />
            )}
            <Text style={styles.tapText}>แตะที่หน้าจอเพื่อไปต่อ</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}


const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // ลบ padding: 20 ออกจาก container
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // เพิ่ม padding เข้ามาใน gradient แทน
  },
  mascot: {
    width: 400,
    height: 400,
    marginBottom: -80,
  },
  // 💡 Container สำหรับรวมตัวเลขและ STACK ให้อยู่ในบรรทัดเดียวกัน
  stackTextContainer: {
    flexDirection: 'column', // แยกเป็นบรรทัด
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
},
stackNumber: {
    fontSize: 60,
    fontWeight: "bold",
},
stackLabel: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 5, // เว้นระยะจากตัวเลข
},

  startText: {
    fontSize: 60, // START ยังคงใช้ขนาด 60
    fontWeight: "bold",
    color: '#5E203B', // สีเดียวกับในรูป (สีส้ม)
    marginBottom: 20,
  },
  tapText: {
    position: "absolute",
    bottom: 50,
    fontSize: 18,
    color: "#fff",
  },
});