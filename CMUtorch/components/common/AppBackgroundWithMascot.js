import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Image } from 'react-native';
import { mascotImages } from '../../assets/config/mascotImages';

const DEFAULT_COLOR = 'orange';
const DEFAULT_MOOD = 'good';

const EMOTION_VARIANTS = {
  happy: {
    orange: { color: 'orange', mood: 'happy' },
    blue: { color: 'blue', mood: 'happy' },
    red: { color: 'red', mood: 'happy' },
    purple: { color: 'purple', mood: 'happy' },
  },
  good: {
    orange: { color: 'orange', mood: 'good' },
    blue: { color: 'blue', mood: 'good' },
    red: { color: 'red', mood: 'good' },
    purple: { color: 'purple', mood: 'good' },
  },
  sad: {
    orange: { color: 'orange', mood: 'sad' },
    blue: { color: 'blue', mood: 'sad' },
    red: { color: 'red', mood: 'sad' },
    purple: { color: 'purple', mood: 'sad' },
  },
};

export default function AppBackgroundWithMascot({
  children,
  mascotColor = DEFAULT_COLOR,
  mascotMood = DEFAULT_MOOD,
  emotion,
}) {
  let resolvedColor = mascotColor;
  let resolvedMood = mascotMood;

  if (emotion && EMOTION_VARIANTS[emotion]) {
    const variantMap = EMOTION_VARIANTS[emotion];
    const targetVariant =
      variantMap[mascotColor] || variantMap[DEFAULT_COLOR];
    if (targetVariant) {
      resolvedColor = targetVariant.color;
      resolvedMood = targetVariant.mood;
    }
  }

  const fallbackImage =
    mascotImages[DEFAULT_COLOR]?.[DEFAULT_MOOD] ||
    require('../../assets/Mascot/theme-base.png');

  const mascotImage =
    mascotImages[resolvedColor]?.[resolvedMood] ||
    fallbackImage;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A6A7FF', '#C490D1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Image
        source={mascotImage}
        style={styles.mascotBg}
        resizeMode="contain"
        pointerEvents="none"
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  mascotBg: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: '80%',
    height: '55%',
    alignSelf: 'center',
    zIndex: 1,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});
