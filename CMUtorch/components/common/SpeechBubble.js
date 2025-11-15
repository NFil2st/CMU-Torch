import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function SpeechBubble({ children, title }) {
  return (
    <View style={styles.speechBubble}>
      {/* หางกรอบข้อความ */}
      <View style={styles.speechBubbleTail} />
      
      <View style={styles.contentWrapper}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    paddingTop: 20,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    minHeight: height * 0.4,
  },
  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    left: 30,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  contentWrapper: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
});
