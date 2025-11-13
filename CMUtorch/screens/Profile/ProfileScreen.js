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
      <Text style={styles.title}>User CMU info</Text>

      <View style={styles.profileBox}>
        <Text style={styles.label}>ชื่อ:</Text>
        <Text style={styles.value}>usertest 123</Text>

        <Text style={styles.label}>รหัสนักศึกษา:</Text>
        <Text style={styles.value}>6512345678</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
  },
  profileBox: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#E57373',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
