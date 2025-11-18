import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import FeatureCard from '../../components/common/ExerciseCard'; // ไม่ได้ใช้ FeatureCard ในหน้านี้
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';
import Constants from 'expo-constants'; // ต้องมี expo-constants
import AsyncStorage from "@react-native-async-storage/async-storage"; // ต้องมี AsyncStorage
import axios from 'axios'; // ใช้ axios

const { width, height } = Dimensions.get('window');

// *** 1. กำหนด API Endpoints ***
const API_BASE_URL = Constants.expoConfig.extra.apiUrl; // ต้องมีการกำหนดใน app.config.js/app.json
const GET_MOOD_API_ENDPOINT = `${API_BASE_URL}/api/getMood`; 
// Endpoint สำหรับดึงรายการแนะนำ (Mood-based)
const GET_EXERCISE_RECOMMENDATION_API_ENDPOINT = `${API_BASE_URL}/api/getExercise`; 

// *** 2. ตัวแปรคงที่สำหรับกำหนด Icon (เหมือนกับ ExerciseListScreen) ***
const EXERCISE_ICONS = {
  // กีฬาจากตาราง (ใช้ไอคอนที่เคยกำหนดไว้)
  'บาสเกตบอล': '🏀', 'วอลเลย์บอล': '🏐', 'ฟุตบอล': '⚽', 'เซปักตะกร้อ': '⚽', 'โบว์โลน่า': '🎳', 
  'วอลเลย์บอลชายหาด': '🏖️', 'ลีลาศ': '💃', 'แบดมินตัน': '🏸', 'ยิงปืน': '🎯', 'ยิงธนู': '🏹',
  'เปตอง': '🎯', 'ดาบไทย': '⚔️', 'ดาบสากล': '⚔️', 'เทเบิลเทนนิส': '🏓', 'ว่ายน้ำ': '🏊‍♂️',
  'ฟิตเนส': '🏋️‍♂️', 'วิ่ง': '🏃‍♂️', 'คาราเต้': '🥋', 'เทควันโด': '🥋', 'ยูโด': '🥋',
  'ยูยิตสู': '🥋', 'ฮับกิโด': '🥋', 'รักบี้ฟุตบอล': '🏉', 'ฮอกกี้': '🏒', 'เทนนิส': '🎾',
  'ซอฟท์บอล': '🥎', 'อื่นๆ': '✨' 
};

// *** 3. ฟังก์ชันแปลง Mood Score เป็น Tag (เหมือนกับโค้ดอาหาร) ***
const moodFromScore = (score) => {
  const numScore = parseFloat(score);
  if (numScore == null || numScore <= 2.5) return "อารมณ์ไม่ดี";
  if (numScore > 2.5 && numScore < 4) return "อารมณ์เฉยๆ";
  if (numScore >= 4) return "อารมณ์ดี";
  return "อารมณ์เฉยๆ"; 
};


export default function ExerciseRecomman({ navigation }) {
    // *** 4. State สำหรับเก็บข้อมูลที่ดึงมา ***
    const [recommendedExercises, setRecommendedExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentMood, setCurrentMood] = useState("อารมณ์เฉยๆ"); // สำหรับแสดงผล

    // ข้อมูล Categories ยังคงเป็น Hardcoded เนื่องจากไม่ได้เชื่อมกับ API Mood-based
    const categories = [
        { title: 'คาร์ดิโอ', emoji: '🏃‍♂️', screen: 'ExerciseList' },
        { title: 'เวทเทรนนิ่ง', emoji: '🏋️‍♀️', screen: 'ExerciseList' },
        { title: 'ยืดเหยียด/โยคะ', emoji: '🤸‍♂️', screen: 'ExerciseList' },
    ];
    
    // *** 5. ฟังก์ชันดึงข้อมูล ***
    const fetchRecommendedExercises = async () => {
        let moodTag = "อารมณ์ดี"; // Default mood tag หากดึงข้อมูลไม่ได้
        
        try {
            setIsLoading(true);
            
            // --- Step 1: ดึง Mood Score ปัจจุบันของผู้ใช้ ---
            const token = await AsyncStorage.getItem("userToken");
            
            const moodResponse = await axios.get(GET_MOOD_API_ENDPOINT, {
                headers: { 'Authorization': `Bearer ${token}` },
            }); 

            const rawMoodScore = moodResponse.data?.data?.mood; 
            if (rawMoodScore) {
                moodTag = moodFromScore(rawMoodScore);
            }
            setCurrentMood(moodTag); // อัปเดตอารมณ์เพื่อแสดงผลในหน้าจอ

            // --- Step 2: ดึงรายการแนะนำการออกกำลังกายตาม Mood Tag ---
            const recommendationUrl = `${GET_EXERCISE_RECOMMENDATION_API_ENDPOINT}?mood=${moodTag}`;
            const exerciseResponse = await axios.get(recommendationUrl);
            
            const result = exerciseResponse.data;

            if (result.success && result.exercise_items) {
                // แปลงข้อมูลที่ได้จาก API ให้มี 'emoji'
                const fetchedExercises = result.exercise_items.map(item => ({
                    id: item.id,
                    name: item.title, // ใช้ title ที่ Backend ส่งมา
                    emoji: EXERCISE_ICONS[item.title] || EXERCISE_ICONS['อื่นๆ'],
                }));
                setRecommendedExercises(fetchedExercises);
            } else {
                Alert.alert("ไม่พบข้อมูล", `ไม่พบการออกกำลังกายที่แนะนำสำหรับอารมณ์: ${moodTag}`);
                setRecommendedExercises([]);
            }

        } catch (error) {
            console.error("Fetch Recommendation Error:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลการแนะนำการออกกำลังกายได้");
        } finally {
            setIsLoading(false);
        }
    };
    
    // *** 6. เรียกฟังก์ชันดึงข้อมูลเมื่อ Component ถูกโหลด ***
    useEffect(() => {
        fetchRecommendedExercises();
    }, []);

    // *** 7. แสดงหน้าจอโหลด ***
    if (isLoading) {
        return (
            <AppBackground>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4299e1" />
                    <Text style={styles.loadingText}>กำลังวิเคราะห์อารมณ์และแนะนำ...</Text>
                </View>
            </AppBackground>
        );
    }


  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />
          <View style={styles.contentWrapper}>
            <Text style={styles.greeting}>อารมณ์ของคุณตอนนี้: <Text style={styles.moodText}>{currentMood}</Text></Text>
            <Text style={styles.greeting}>นี่คือการออกกำลังกายที่เหมาะกับคุณ!</Text>

            {/* ScrollView แนวนอนแสดง Exercise Preview (ดึงจาก API) */}
            <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.exerciseScroll}
            >
                {/* 💡 ใช้ recommendedExercises ที่ดึงมาจาก API */}
                {recommendedExercises.length > 0 ? (
                    recommendedExercises.map((card) => (
                        <TouchableOpacity
                            key={card.id}
                            style={styles.exerciseCard}
                            onPress={() => navigation.navigate('ExerciseDetail', { 
                                exercise: { 
                                    title: card.name, 
                                    icon: card.emoji // ใช้ emoji เป็น icon ในหน้า detail
                                } 
                            })}
                        >
                            <Text style={styles.exerciseEmoji}>{card.emoji}</Text>
                            <Text style={styles.exerciseName}>{card.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noDataText}>ไม่พบรายการที่แนะนำสำหรับอารมณ์นี้</Text>
                )}
            </ScrollView>

            <Text style={styles.greeting}>หรือดูตามหมวดหมู่ที่คุณสนใจ:</Text>
            {/* ScrollView แนวนอนแสดง Categories (Hardcoded) */}
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
                                title: card.title,  
                                icon: card.emoji 
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
    justifyContent: 'flex-start', // เปลี่ยนเป็น flex-start
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
  moodText: {
    color: '#4299e1', // สีเน้นสำหรับอารมณ์
    fontWeight: '900',
  },
  exerciseScroll: {
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 20,
    // ปรับความสูงของ ScrollView ให้มีขอบเขตชัดเจน (เผื่อขนาดการ์ด)
    maxHeight: 200, 
  },
  exerciseCard: {
    height: 160, // ปรับความสูงเล็กน้อย
    width: 140,  // ปรับความกว้างเล็กน้อย
    backgroundColor: '#f5f5f5', // เปลี่ยนสีพื้นหลังให้ดูเป็น Card
    borderRadius: 15,
    marginRight: 10,
    padding: 10,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    color: '#444',
  },
  exerciseEmoji: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4299e1',
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
  }
});