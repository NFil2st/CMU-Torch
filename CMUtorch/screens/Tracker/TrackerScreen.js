import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';

const { width, height } = Dimensions.get('window');

const cards = [
  { title: 'เหนื่อยจัง', icon: '😩', screen: 'Home' },
  { title: 'ก็สบายดี', icon: '😌', screen: 'Home' },
  { title: 'เยี่ยมเลย', icon: '😎', screen: 'Home' },
];

// แปลง index → mood value
const moodValueMap = [0, 3, 5]; // 0=แย่, 3=ดี, 5=เยี่ยม

export default function TrackerScreen({ navigation }) {
  const [userMood, setUserMood] = useState(null); // เก็บ mood ล่าสุด

  const handleMoodPress = async (index) => {
    try {
      const moodValue = moodValueMap[index];
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const res = await fetch('http://10.122.2.193:3000/api/updateMood', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moodValue }),
      });

      const data = await res.json();
      if (data.success) {
        console.log('Updated mood:', data.mood);
        setUserMood(data.mood); // อัพเดท mascot / state
      }

      // ถ้ามี screen ให้ navigate
      const screen = cards[index].screen;
      if (screen) navigation.navigate(screen);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBackgroundWithMascot emotion={userMood}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />
          <View style={styles.contentWrapper}>
            <Text style={styles.greeting}>สวัสดี ช่วงนี้เป็นยังไงบ้าง ?</Text>
            <View style={styles.grid}>
              {cards.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMoodPress(index)}
                  style={styles.optionWrapper}
                >
                  <View style={styles.card}>
                    <View style={styles.content}>
                      <Text style={styles.icon}>{card.icon}</Text>
                      <Text style={styles.title}>{card.title}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </AppBackgroundWithMascot>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  speechBubble: {
    height: height * 0.5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    alignSelf: 'flex-start',
    left: 30,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  contentWrapper: { paddingHorizontal: 15, paddingTop: 25, paddingBottom: 20 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#333', paddingBottom: 25 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  optionWrapper: { width: (width - 40 - 20) / 3, height: 'auto' },
  content: { alignItems: 'center' },
  icon: { fontSize: 20, marginBottom: 5 },
  title: { fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' },
});
