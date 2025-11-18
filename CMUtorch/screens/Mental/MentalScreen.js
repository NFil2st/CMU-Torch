import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatureCard from '../../components/common/MentalCard';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';
import Constants from "expo-constants";
import { questionSets } from "./questions";

const API_URL = Constants.expoConfig.extra.apiUrl;
const { width, height } = Dimensions.get('window');

const moodFromScore = (score) => {
  if (score == null || score <= 2.5) return "bad";
  if (score > 2.5 && score < 4) return "good";
  if (score >= 4) return "happy";
  return "good";
};

export default function MentalScreen({ navigation }) {

  const [moodType, setMoodType] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/getMood`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json(); // { mood: 0–5 }

        const type = parseFloat(data.data?.mood);
        setMoodType(moodFromScore(type));

      } catch (err) {
        console.log("fetch mood error:", err);
      }
    };

    fetchMood();
  }, []);

  if (!moodType) return null;  // ยังโหลด mood
  console.log("Current mood type:", moodType);
  const questions = questionSets[moodType];
  if (!questions) return null;

  const qData = questions[currentIndex];

  const handleSelect = (score) => {
    const updated = totalScore + score;
    const isLast = currentIndex === questions.length - 1;

    if (!isLast) {
      setTotalScore(updated);
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("MentalResultScreen", {
        score: updated,
        totalQuestions: questions.length
      });
    }
  };

  return (
    <AppBackgroundWithMascot>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <View style={styles.speechBubble}>
        <View style={styles.speechBubbleTail} />

        <View style={styles.contentWrapper}>
          <Text style={styles.greeting}>{qData.question}</Text>

          <View style={styles.grid}>
            {qData.choices.map((item, index) => (
              <FeatureCard
                key={index}
                title={item.label}
                colors={pickColors(index)}
                onPress={() => handleSelect(item.score)}
              />
            ))}
          </View>
        </View>
      </View>

    </AppBackgroundWithMascot>
  );
}

function pickColors(index) {
  const sets = [
    ['#ff616f', '#ff94fc'],
    ['#fff7ad', '#ffa9f9'],
    ['#38beef', '#8ce0ff'],
    ['#48ee6c', '#e894ff']
  ];
  return sets[index % sets.length];
}

const styles = StyleSheet.create({
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: width,
    height: '100%',
    marginTop: height * 0.45,
    paddingBottom: 30,
    elevation: 8,
  },
  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    left: 40,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  contentWrapper: { padding: 20, paddingTop: 35 },
  greeting: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
