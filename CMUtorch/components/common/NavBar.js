import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavBar({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavigate = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* ปุ่มเบอร์เกอร์ */}
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>

      {/* เมนู Overlay */}
      {menuVisible && (
        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => handleNavigate('Home')} style={styles.menuItem}>
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate('Profile')} style={styles.menuItem}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate('Summarize')} style={styles.menuItem}>
            <Text style={styles.menuText}>Summarize</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigate('Settings')} style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 25,
    zIndex: 20,
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25, // ✅ ทำให้กลม (ครึ่งหนึ่งของขนาด)
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  menuContainer: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
