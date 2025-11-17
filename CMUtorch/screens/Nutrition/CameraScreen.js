import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { View, Button, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const API_URL = Constants.expoConfig.extra.apiUrl;
const { width, height } = Dimensions.get('window');

// 💡 Component ใหม่สำหรับหน้า Loading Overlay
const LoadingOverlay = () => (
  <View style={styles.loadingOverlay}>
    <View style={styles.loadingCard}>
        <ActivityIndicator
            size="large"
            color="#007AFF" // สีน้ำเงินมาตรฐาน
        />
        <Text style={styles.loadingText}>กำลังวิเคราะห์อาหาร...</Text>
        <Text style={styles.loadingSubtitle}>โปรดรอสักครู่</Text>
    </View>
  </View>
);

export default function CameraScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [facing, setFacing] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const cameraRef = useRef(null);

  const { food } = route.params || {}; 

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>เราต้องการสิทธิ์ในการเข้าถึงกล้องเพื่อใช้งาน</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>อนุญาตการใช้งานกล้อง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlashMode = () => {
    setFlashMode(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off'; // cycle: off -> on -> auto -> off
    });
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true); // เริ่ม Loading
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });

      const form = new FormData();
      form.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      if (food) {
          form.append("food_id", food.id.toString());
          form.append("food_name", food.name);
      }

      const token = await AsyncStorage.getItem("userToken"); 
      const headers = { "Content-Type": "multipart/form-data" };
      if (token) {
          headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${API_URL}/api/scan-food`,
        form,
        { headers }
      );

      const scanResult = response.data;
      
      // ***สมมติว่า Backend คืน { success: true, predictions: [] } เมื่อไม่พบอาหาร***
      if (scanResult.success && scanResult.predictions && scanResult.predictions.length > 0) {
        
        // 1. ค้นหาเจอ -> ไปหน้า Success
        navigation.navigate("ScanSuccess", { data: scanResult, foodData: food }); 
        
      } else if (scanResult.success && scanResult.predictions && scanResult.predictions.length === 0) {
          
        // 2. ค้นหาไม่เจอ (Success แต่ผลลัพธ์ว่างเปล่า) -> แจ้งเตือนให้ถ่ายใหม่
        Alert.alert(
            "ไม่พบอาหาร",
            "ไม่สามารถระบุอาหารในภาพได้ กรุณาวางอาหารให้ชัดเจนในกรอบแล้วลองถ่ายใหม่อีกครั้ง",
            [{ text: "ตกลง" }]
        );
        setIsLoading(false); // ปิด Loading และค้างอยู่หน้าเดิม
        
      } else {
          
        // 3. API ตอบกลับไม่ Success หรือมีข้อผิดพลาดเฉพาะ
        const errorMessage = scanResult.message || "การสแกนล้มเหลว กรุณาลองใหม่";
        throw new Error(errorMessage);
      }

    } catch (error) {
      // ❌ ปรับปรุง Log: ซ่อน Axios Error / 500 จาก Log สาธารณะ
      console.error("Scanning failed. Error details (internal):", error.message || error.code || error);
      
      // ❌ ซ่อนข้อผิดพลาดทางเทคนิคจากผู้ใช้
      let userFacingMessage = "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";

      if (axios.isAxiosError(error) && error.response) {
          // ถ้า Server ส่งข้อความ error ที่อ่านได้กลับมา
          userFacingMessage = error.response.data?.message || userFacingMessage;
      } else if (error instanceof Error && error.message.includes("การสแกนล้มเหลว")) {
          // ถ้าเป็น Custom Error ที่โยนจากบล็อก else ด้านบน
          userFacingMessage = error.message;
      }
      
      Alert.alert("เกิดข้อผิดพลาด", userFacingMessage);
      setIsLoading(false); 
    }
  };

  const getFlashIcon = (mode) => {
    switch (mode) {
      case 'on': return 'flash';
      case 'off': return 'flash-off';
      case 'auto': return 'flash-auto';
      default: return 'flash-off';
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <CameraView 
        style={styles.cameraPreview} 
        ref={cameraRef} 
        facing={facing}
        flash={flashMode}
      />

      {/* Header / Navbar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>สแกนอาหาร</Text>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFlashMode}>
          <Ionicons name={getFlashIcon(flashMode)} size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Overlay Frame */}
      <View style={styles.overlayContainer}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.targetFrame}>
              <Text style={styles.targetFrameText}>วางอาหารในกรอบนี้</Text>
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {/* ปุ่มควบคุมด้านล่าง */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing} disabled={isLoading}>
          <Ionicons name="camera-reverse" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto} disabled={isLoading}>
          <View style={styles.captureInnerCircle} />
        </TouchableOpacity>
        <View style={styles.iconButtonPlaceholder} /> 
      </View>
      
      {/* 💡 แสดง Loading Overlay เมื่อ isLoading เป็น true */}
      {isLoading && <LoadingOverlay />}

    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  cameraPreview: { 
    flex: 1 
  },
  
  // 💡 Loading Overlay Styles
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // พื้นหลังสีดำโปร่งแสง
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // ต้องอยู่เหนือทุกองค์ประกอบ
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },

  // Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
    height: 90,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconButton: {
    padding: 5,
  },
  iconButtonPlaceholder: {
    width: 38,
  },

  // Overlay Styles (สำหรับกรอบแนะนำ)
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  overlayTop: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    width: '100%',
    height: width * 0.7,
  },
  overlaySide: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  targetFrame: {
    width: width * 0.7,
    height: '100%',
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetFrameText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayBottom: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // Button Container (ด้านล่าง)
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    zIndex: 5,
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Permission Screen
  permissionContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#333' 
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});