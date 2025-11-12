import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/ExerciseCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';

const { width, height } = Dimensions.get('window');

export default function ExerciseRecommendationScreen({ navigation }) {

  // ตัวอย่างภาพ Exercise (อาจใช้ไอคอนหรือรูปจริง)
  const exercisesPreview = [
    { id: 1, name: 'บาสเกตบอล', image: require('../../assets/favicon.png') },
    { id: 2, name: 'ว่ายน้ำ', image: require('../../assets/favicon.png') },
    { id: 3, name: 'โยคะ', image: require('../../assets/favicon.png') },
  ];

  // ประเภทการออกกำลังกาย (Feature Card)
  const categories = [
    { title: 'คาร์ดิโอ', image: require('../../assets/favicon.png'), screen: 'ExerciseList' },
    { title: 'เวทเทรนนิ่ง', image: require('../../assets/favicon.png'), screen: 'ExerciseList' },
    { title: 'ยืดเหยียด/โยคะ', image: require('../../assets/favicon.png'), screen: 'ExerciseList' },
  ];

  return (
    <AppBackground>
      <BackButton navigation={navigation} />

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
              {exercisesPreview.map((item) => (
                <View key={item.id} style={styles.exerciseCard}>
                  <Image source={item.image} style={styles.exerciseImage} />
                  <Text style={styles.exerciseName}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>


            <Text style={styles.greeting}>ลองดูประเภทที่เหมาะกับคุณ!</Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.exerciseScroll}
            >
              {categories.map((item) => (
                <View key={item.title} style={styles.exerciseCard}>
                  <Image source={item.image} style={styles.exerciseImage} />
                  <Text style={styles.exerciseName}>{item.title}</Text>
                </View>
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
});
