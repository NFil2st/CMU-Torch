import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { View, Button, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="อนุญาตการใช้งานกล้อง" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });

      const form = new FormData();
      form.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });


      const response = await axios.post(
        "http://192.168.11.239:3000/api/scan-food",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigation.navigate("ScanSuccess", { data: response.data });
    } catch (error) {
      console.log("Error taking photo or uploading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.fullScreenBackground}>
      <CameraView style={styles.fullScreenBackground} ref={cameraRef} />

      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loadingIndicator}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>ถ่ายรูป</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: { flex: 1 },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
});
