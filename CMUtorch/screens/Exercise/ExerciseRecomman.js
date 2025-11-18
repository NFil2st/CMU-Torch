import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import FeatureCard from '../../components/common/ExerciseCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function ExerciseRecommendationScreen({ navigation }) {

  // ตัวอย่างภาพ Exercise (อาจใช้ไอคอนหรือรูปจริง)
// เปลี่ยน exercisesPreview และ categories เป็นอิโมจิ
const exercisesPreview = [
  { id: 1, name: 'บาสเกตบอล', emoji: '🏀' },
  { id: 2, name: 'ว่ายน้ำ', emoji: '🏊‍♂️' },
  { id: 3, name: 'โยคะ', emoji: '🧘‍♀️' },
];

const categories = [
  { title: 'คาร์ดิโอ', emoji: '🏃‍♂️', screen: 'ExerciseList' },
  { title: 'เวทเทรนนิ่ง', emoji: '🏋️‍♀️', screen: 'ExerciseList' },
  { title: 'ยืดเหยียด/โยคะ', emoji: '🤸‍♂️', screen: 'ExerciseList' },
];

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />
          <View style={styles.contentWrapper}>
            <Text style={styles.greeting}>อยากออกกำลังกายให้สนุก?</Text>
            <Text style={styles.greeting}>ลองดูประเภทที่เหมาะกับคุณ!</Text>

            {/* ScrollView แนวนอนแสดง Exercise Preview */}
            <ScrollView
  horizontal
  nestedScrollEnabled
  showsHorizontalScrollIndicator={false}
  style={styles.exerciseScroll}
>
  {exercisesPreview.map((card) => (
    <TouchableOpacity
      key={card.id}
      style={styles.exerciseCard}
      onPress={() => navigation.navigate('ExerciseDetail', { 
  exercise: { 
    title: card.name || card.title,  // ใช้ name สำหรับ exercises, title สำหรับ categories
    emoji: card.emoji 
  } 
})}

    >
      <Text style={styles.exerciseEmoji}>{card.emoji}</Text>
      <Text style={styles.exerciseName}>{card.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

            <Text style={styles.greeting}>ลองดูประเภทที่เหมาะกับคุณ!</Text>
            <ScrollView
  horizontal
  nestedScrollEnabled
  showsHorizontalScrollIndicator={false}
  style={styles.exerciseScroll}
>
  {categories.map((card) => (
    <TouchableOpacity
      key={card.title}
      style={styles.exerciseCard}
      onPress={() => navigation.navigate('ExerciseDetail', { 
  exercise: { 
    title: card.name || card.title,  // ใช้ name สำหรับ exercises, title สำหรับ categories
    emoji: card.emoji 
  } 
})}

    >
      <Text style={styles.exerciseEmoji}>{card.emoji}</Text>
      <Text style={styles.exerciseName}>{card.title}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

          </View>
        </View>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    height: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'flex-end',
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
  contentWrapper: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 30,
    flex: 1,
  },
  greeting: {
    textAlign: 'start',
    paddingBottom: 10,
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  exerciseScroll: {
    width: '100%',
    paddingHorizontal: 9,
    marginBottom: 20,
  },
  exerciseCard: {
    height: 180,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 12,
    padding: 10,
    elevation: 3,
  },
  exerciseImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  exerciseEmoji: {
  fontSize: 60,      // ขนาดใหญ่พอดี
  textAlign: 'center',
  marginBottom: 10,
},

});
