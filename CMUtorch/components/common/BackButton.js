// ตัวอย่างไฟล์ BackButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
// ใช้ Icon จาก library เช่น 'react-native-vector-icons' หรือ 'expo-icons'
import { Ionicons } from '@expo/vector-icons'; 

const BackButton = ({ navigation }) => {
    return (
        <TouchableOpacity 
            style={backStyles.button} 
            // ฟังก์ชัน onPress จะใช้ navigation.goBack() เพื่อย้อนกลับหน้า
            onPress={() => navigation.goBack()}
        >
            {/* ใช้ Icon 'chevron-back' หรือ 'arrow-back' */}
            <Ionicons name="chevron-back" size={30} color="#333" /> 
        </TouchableOpacity>
    );
};

const backStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 50, // ปรับค่านี้เพื่อเว้นระยะห่างจากขอบบนของจอ (รวม StatusBar)
        left: 20, // ปรับค่านี้เพื่อเว้นระยะห่างจากขอบซ้าย
        zIndex: 10, // สำคัญ: ให้ปุ่มอยู่เหนือองค์ประกอบอื่นๆ
        padding: 5,
    },
});

export default BackButton;