import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const res = await axios.get(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.data);

      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4AD1A9" style={{ flex: 1 }} />;

  if (!user) return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>ไม่พบข้อมูลผู้ใช้</Text>;

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>User CMU info</Text>

        <View style={styles.profileBox}>
          <Text style={styles.label}>ชื่อ:</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>username</Text>
          <Text style={styles.value}>{user.username}</Text>

          <Text style={styles.label}>อีเมล CMU:</Text>
          <Text style={styles.value}>{user.cmumail}</Text>

          <Text style={styles.label}>สาขา:</Text>
          <Text style={styles.value}>{user.major}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 40 },
  profileBox: { width: '100%', backgroundColor: '#F8F8F8', padding: 20, borderRadius: 15, marginBottom: 30, borderWidth: 1, borderColor: '#E0E0E0' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 5 },
  value: { fontSize: 16, color: '#555', marginBottom: 10 },
  logoutButton: { marginTop: 20, backgroundColor: '#E57373', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 15 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
