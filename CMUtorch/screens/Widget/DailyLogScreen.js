// DailyLogScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import DailyLogWidget from './DailyLogWidget';

const DailyLogScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <DailyLogWidget />
        <DailyLogWidget />
        <DailyLogWidget />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 16, // spacing ระหว่าง widget (React Native 0.70+ รองรับ)
  },
});

export default DailyLogScreen;
