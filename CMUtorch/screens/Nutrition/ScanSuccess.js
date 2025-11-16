import React from "react";
import { View, Text } from "react-native";

export default function ScanSuccess({ route }) {
  const { data } = route.params;

  console.log("📦 DATA:", data);

  // ตอนนี้ predictions เป็น array ของชื่อ class ตรง ๆ
  const predictions = data?.predictions || [];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>ผลลัพธ์การสแกน</Text>

      {predictions.length > 0 ? (
        predictions.map((item, index) => (
          <Text key={index}>🍽 {item}</Text>
        ))
      ) : (
        <Text>ไม่พบอาหาร</Text>
      )}
    </View>
  );
}
