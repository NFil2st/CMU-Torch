import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function AppBackground({ children }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A6A7FF', '#C490D1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill} // ✅ ปูเต็มจอ
        
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
