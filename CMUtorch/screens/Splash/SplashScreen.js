import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setTimeout(() => {
          if (token) {
            navigation.replace('Tracker');
          } else {
            navigation.replace('Login');
          }
        }, 1500);
      } catch (e) {
        console.log('Error reading token', e);
        navigation.replace('Login');
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      {/* welcome to ด้านบน เล็กกว่า */}
      <Text style={styles.welcomeText}>welcome to</Text>

      {/* CMU + torch ต่อกัน */}
      <View style={styles.row}>
        <Text style={styles.cmuText}>CMU</Text>
        <Text style={styles.torchText}>torch</Text>
      </View>

      <ActivityIndicator size="large" color="#A66DBB" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,       // เล็กกว่า CMU/torch
    color: '#A66DBB',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',   // ต่อกันในแถวเดียว
    alignItems: 'center',
  },
  cmuText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#A66DBB',
  },
  torchText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#EFA04C',
  },
});
