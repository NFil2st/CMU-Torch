import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get('window'); // 💡 ดึงค่าความสูงของจอมาใช้

const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
const GET_MOOD_API_ENDPOINT = `${API_BASE_URL}/api/getMood`; // Endpoint ดึงอารมณ์
const GET_FOOD_LIST_API_ENDPOINT = `${API_BASE_URL}/api/getFoodList`; // Endpoint ดึงรายการอาหาร

// 💡 ฟังก์ชันแปลง Mood Score เป็น Tag 
const moodFromScore = (score) => {
  const numScore = parseFloat(score);
  if (numScore == null || numScore <= 2.5) return "อารมณ์ไม่ดี";
  if (numScore > 2.5 && numScore < 4) return "อารมณ์เฉยๆ";
  if (numScore >= 4) return "อารมณ์ดี";
  return "อารมณ์เฉยๆ"; 
};


export default function NutritionList({ route, navigation }) {
    const { type, title } = route.params;
    
    const [foods, setFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleFoodPress = (food) => {
        navigation.navigate('CameraScreen', { food });
    };

    const fetchFoodList = async (userGoalType) => {
        let moodTag = "อารมณ์เฉยๆ"; // Default 
        
        try {
            // --- Step 1: ดึง Mood Score ---
            const token = await AsyncStorage.getItem("userToken");
            
            const moodResponse = await fetch(GET_MOOD_API_ENDPOINT, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
            }); 

            if (moodResponse.ok) {
                const moodResult = await moodResponse.json();
                const rawMoodScore = moodResult?.data?.mood; 
                if (rawMoodScore) {
                    moodTag = moodFromScore(rawMoodScore);
                }
            } else {
                console.warn(`Mood API failed: ${moodResponse.status}. Using default mood.`);
            }

            // --- Step 2: ดึงอาหารตาม Mood Tag และ Goal Type ---
            // เราใช้ Goal Type ภาษาอังกฤษ (type) ใน Query Parameter และ Backend จะแปลงเป็นภาษาไทย
            const foodResponse = await fetch(`${GET_FOOD_LIST_API_ENDPOINT}?mood=${moodTag}&goal=${userGoalType}`);
            
            if (!foodResponse.ok) {
                throw new Error(`Food List API failed: ${foodResponse.status}`);
            }

            const foodResult = await foodResponse.json();

            if (foodResult.success && foodResult.food_items) {
                const fetchedFoods = foodResult.food_items.map(food => ({
                    id: food.id,
                    name: food.name,
                    image: { uri: food.imagea }, // เปลี่ยน imagea เป็น { uri: ... }
                }));
                setFoods(fetchedFoods);
            } else {
                Alert.alert("ไม่พบข้อมูล", `ไม่พบอาหารที่ตรงกับเป้าหมาย (${title}) และอารมณ์ของคุณ`);
                setFoods([]);
            }

        } catch (error) {
            console.error("Fetch Food List Error:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลรายการอาหารได้");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        setIsLoading(true);
        fetchFoodList(type); // type คือ 'increase' หรือ 'decrease'
    }, [type]);


    return (
        <AppBackground>
        <View style={styles.fullScreenContainer}> 
            <BackButton navigation={navigation} />
            
            <View style={styles.speechBubble}>
                <View style={styles.speechBubbleTail} />
                <View style={styles.contentWrapper}>

                    <Text style={styles.title}>{title}</Text>

                    {/* 💡 ScrollView อยู่ภายใน Bubble เพื่อให้เนื้อหา scroll ได้ */}
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 40 }} />
                        ) : foods.length === 0 ? (
                            <Text style={styles.noDataText}>ไม่พบรายการอาหารที่แนะนำสำหรับเป้าหมายนี้</Text>
                        ) : (
                            foods.map((food) => (
                                <TouchableOpacity
                                    key={food.id}
                                    style={styles.foodCard}
                                    onPress={() => handleFoodPress(food)}
                                >
                                    <Image source={food.image} style={styles.foodImage} />
                                    <Text style={styles.foodName}>{food.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>

                </View>
            </View>
        </View>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20, // เว้นด้านล่างนิดหน่อย
    },
    
    // 💡 Bubble Style
    speechBubble: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 30,
        height: height * 0.80, // 💡 ตั้งความสูงเป็น 80% ของหน้าจอ
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

    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // 💡 ScrollView Content
    scrollContent: {
        paddingBottom: 20, // Padding ด้านล่างของรายการ
        alignItems: 'center',
    },
    
    // ส่วนแสดงผล Title
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center', // จัดให้อยู่ตรงกลาง bubble
    },
    
    // ส่วนแสดงผล Food Card
    foodCard: {
        width: '95%',
        borderRadius: 15,
        backgroundColor: '#f9f9f9', // เปลี่ยนสีพื้นหลังเล็กน้อยให้ดูแตกต่างจาก bubble
        marginBottom: 15,
        padding: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    foodImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    foodName: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
        marginTop: 30,
        textAlign: 'center',
    }
});