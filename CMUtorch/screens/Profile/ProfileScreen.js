import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';

export default function ProfileScreen({ navigation }) {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('tokenExpire');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <View style={styles.container}>
        
        <Text style={styles.title}>ข้อมูลส่วนตัว</Text>

        <View style={styles.profileBox}>
          <View style={styles.row}>
            <Text style={styles.label}>ชื่อ</Text>
            <Text style={styles.value}>usertest 123</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>CMU ID</Text>
            <Text style={styles.value}>6512345678</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    letterSpacing: 0.3,
  },

  profileBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 22,
    borderRadius: 18,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },

  row: {
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },

  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4c00c7ff',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 14,
  },

  logoutButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 20,
    shadowColor: '#D9534F',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
