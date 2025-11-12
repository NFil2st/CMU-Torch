import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const BackButton = ({ navigation }) => {
  // ตรวจสอบว่ามีหน้าที่จะย้อนกลับไหม
  if (!navigation.canGoBack()) {
    return null; // ไม่มี back → ซ่อนปุ่ม
  }

  return (
    <TouchableOpacity 
      style={backStyles.button} 
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back" size={30} color="#333" /> 
    </TouchableOpacity>
  );
};

const backStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
});

export default BackButton;
