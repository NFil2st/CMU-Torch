import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage"; // 💡 เพิ่ม Import AsyncStorage

const API_BASE_URL = Constants.expoConfig.extra.apiUrl;

const { width, height } = Dimensions.get('window');

// 💡 ใช้ /api/me (ตาม Router ที่คุณกำหนด)
const GET_MOOD_API_ENDPOINT = `${API_BASE_URL}/api/getMood`; 
const GET_FOOD_API_ENDPOINT = `${API_BASE_URL}/api/getFood`; 

// 1. ฟังก์ชันแปลง Mood Score เป็น Tag (ใช้ภาษาไทยตามที่กำหนด)
const moodFromScore = (score) => {
  const numScore = parseFloat(score); // แปลงเป็นตัวเลข
  if (numScore == null || numScore <= 2.5) return "อารมณ์ไม่ดี";
  if (numScore > 2.5 && numScore < 4) return "อารมณ์เฉยๆ";
  if (numScore >= 4) return "อารมณ์ดี";
  return "อารมณ์เฉยๆ"; // Default เป็นภาษาไทย
};

// 2. ฟังก์ชันดึง Mood และเรียก API อาหาร
const fetchRecommendedFoods = async () => {
  let moodTagToFetch = "อารมณ์เฉยๆ"; // 💡 Default Mood Tag เป็นภาษาไทย (อารมณ์เฉยๆ)
  
  try {
    // 💡 ดึง Token ก่อน
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
        console.warn("User not logged in. Using default mood for recommendations.");
    }
    
    // --- Step 1: ดึง Mood Score ---
    const moodResponse = await fetch(GET_MOOD_API_ENDPOINT, {
        headers: { 
            'Authorization': `Bearer ${token}` 
        },
    }); 
    
    // หากไม่สำเร็จ (เช่น 401 Unauthorized หรือ 404) จะโยน error
    if (!moodResponse.ok) throw new Error(`Mood API failed: ${moodResponse.status}`);
    
    const moodResult = await moodResponse.json();
    const rawMoodScore = moodResult?.data?.mood; // ดึงค่า mood จาก response

    if (rawMoodScore) {
        // แปลง Score เป็น Tag ภาษาไทย
        moodTagToFetch = moodFromScore(rawMoodScore);
    } else {
        console.warn("Mood score is missing or null. Using default mood.");
    }

  } catch (error) {
    console.error("Error fetching mood:", error);
    // หากดึง Mood ไม่ได้ ให้ใช้ Default Tag ที่ตั้งไว้ตอนแรก
  }
  
  // --- Step 2: ดึงอาหารตาม Mood Tag (ไม่ว่าจะดึงได้หรือไม่ก็ตาม) ---
  return await fetchFoodByMood(moodTagToFetch);
};

// ฟังก์ชันย่อยสำหรับเรียก API อาหารด้วย Mood Tag
const fetchFoodByMood = async (moodTag) => {
    try {
        // 💡 ส่ง Mood Tag (ภาษาไทย) เข้าไปใน Query Parameter
        const foodResponse = await fetch(`${GET_FOOD_API_ENDPOINT}?mood=${moodTag}`);
        
        if (!foodResponse.ok) throw new Error(`Food API failed: ${foodResponse.status}`);

        const foodResult = await foodResponse.json();

        if (foodResult.success && foodResult.food_items) {
            const foods = foodResult.food_items.map(food => ({
                id: food.id,
                name: food.name,
                mood_tag: food.mood_tag,
                image_url: food.imagea, // ใช้คอลัมน์ imagea เป็น URL
            }));
            return foods;
        } else {
            console.warn(foodResult.message || `No food items returned for mood: ${moodTag}`);
            return [];
        }
    } catch (error) {
        console.error("Error fetching food:", error);
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลอาหารแนะนำได้");
        return [];
    }
}


export default function ExerciseRecommendationScreen({ navigation }) {

  const categories = [
    { id: 1, title: 'เพิ่มน้ำหนัก', colors: ['#f24242', '#e894ff'], screen: 'NutritionList', type: 'increase' },
    { id: 2, title: 'ลดน้ำหนัก', colors: ['#48ee6c', '#e894ff'], screen: 'NutritionList', type: 'decrease' },
  ];

  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFoods = async () => {
      setIsLoading(true);
      const foods = await fetchRecommendedFoods();
      setRecommendedFoods(foods);
      setIsLoading(false);
    };

    loadFoods();
  }, []);

const handleFoodPress = (food) => {
    // ✅ แก้ไข: ส่ง foodId และ foodName ไปแทน
    navigation.navigate('mapFood', { 
        foodId: food.id, 
        foodName: food.name,
    });
  };

  return (
    <AppBackgroundWithMascot>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.innerScroll}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={styles.contentWrapper}>
              
              <Text style={styles.title}>อยากเลือกอาหารให้เหมาะกับคุณไหม?</Text>
              <Text style={styles.subtitle}>เลือกหมวดหมู่อาหารที่ต้องการ!</Text>

              {/* หมวดหมู่อาหาร (ไม่เปลี่ยนแปลง) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingHorizontal: 15 }}
              >
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.cardWrapper}
                    onPress={() =>
                      navigation.navigate(item.screen, {
                        id: item.id,
                        title: item.title,
                        colors: item.colors,
                        type: item.type,
                      })
                    }
                  >
                    <LinearGradient
                      colors={item.colors}
                      style={styles.categoryCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>


              <Text style={styles.subtitle}>อาหารแนะนำสำหรับคุณ</Text>

              {/* อาหารแนะนำ */}
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 25 }} />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                >
                  {recommendedFoods.map((item) => (
                    <TouchableOpacity
                      key={item.id} 
                      style={styles.foodCard}
                      onPress={() => handleFoodPress(item)}
                    >
                      <Image 
                          source={{ uri: item.image_url }} 
                          style={styles.foodImage} 
                      />
                      <Text style={styles.foodName}>{item.name}</Text>
                      <Text style={styles.foodMoodTag}>{item.mood_tag}</Text> 
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </AppBackgroundWithMascot>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },

  cardWrapper: {
    marginRight: 15,
  },

  categoryCard: {
    height: 50,
    width: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },


  /* Base White Speech Bubble */
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    height: height * 0.55,       // เพิ่มความสูง 55% ของจอ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 8,
    paddingTop: 20,
    overflow: 'hidden',
  },

  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },

  innerScroll: {
    flex: 1,
    paddingHorizontal: 15,
  },

  contentWrapper: {
    paddingTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    paddingBottom: 6,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 15,
    color: '#444',
  },

  horizontalScroll: {
    marginBottom: 25,
  },

  foodCard: {
    height: 150,
    width: 160,
    backgroundColor: '#fff',
    marginRight: 12,
    padding: 10,
    borderRadius: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  foodImage: {
    width: '100%',
    height: '60%', 
    borderRadius: 12,
    resizeMode: 'cover',
  },

  foodName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },

  foodMoodTag: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
    color: '#888', 
  }
});