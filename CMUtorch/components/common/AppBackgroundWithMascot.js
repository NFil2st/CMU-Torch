import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Image } from 'react-native';

export default function AppBackgroundWithMascot({ children }) {
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/Mascot/theme-base.png')}
        style={styles.mascotBg}
        resizeMode="contain"
      />

      <LinearGradient
        colors={['#A6A7FF', '#C490D1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mascotBg: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    width: '100%',
    height: 350,
    alignSelf: 'center',
    zIndex: 1,
    opacity: 1,
  },
});
