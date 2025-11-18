import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import FeatureCard from '../../components/common/ExerciseCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';
import axios from 'axios'; 
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const { width, height } = Dimensions.get('window'); 

// *** อัปเดต: รายการ ICON ที่ครอบคลุมกีฬาทั้งหมดจากตาราง 'sports' ***
const EXERCISE_ICONS = {
  // กีฬาจากตาราง
  'บาสเกตบอล': '🏀',
  'วอลเลย์บอล': '🏐',
  'ฟุตบอล': '⚽',
  'เซปักตะกร้อ': '⚽', // ใช้ไอคอนบอล
  'โบว์โลน่า': '🎳', // สมมติว่าเป็นโบว์ลิ่ง
  'วอลเลย์บอลชายหาด': '🏖️',
  'ลีลาศ': '💃',
  'แบดมินตัน': '🏸',
  'ยิงปืน': '🎯', 
  'ยิงธนู': '🏹',
  'เปตอง': '🎯',
  'ดาบไทย': '⚔️', // ใช้ไอคอนดาบไขว้
  'ดาบสากล': '⚔️', // ใช้ไอคอนดาบไขว้
  'เทเบิลเทนนิส': '🏓',
  'ว่ายน้ำ': '🏊‍♂️',
  'ฟิตเนส': '🏋️‍♂️',
  'วิ่ง': '🏃‍♂️',
  'คาราเต้': '🥋', // ใช้ชุดยูโด/คาราเต้
  'เทควันโด': '🥋',
  'ยูโด': '🥋',
  'ยูยิตสู': '🥋',
  'ฮับกิโด': '🥋',
  'รักบี้ฟุตบอล': '🏉',
  'ฮอกกี้': '🏒',
  'เทนนิส': '🎾',
  'ซอฟท์บอล': '🥎',
  
  // Default icon สำหรับรายการที่ไม่มีการกำหนด
  'อื่นๆ': '✨' 
};

// *** URL ของ API Backend ของคุณ ***
// **โปรดเปลี่ยนเป็น Base URL ของ Server คุณ**
const API_BASE_URL = `${API_URL}/api`; 


export default function ExerciseListScreen({ navigation }) {
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExerciseList = async () => {
        try {
            const url = `${API_BASE_URL}/getExerciseList`;
            // ใช้ axios เรียก API /getExerciseList
            const response = await axios.get(url);

            if (response.data && response.data.data) {
                // ข้อมูลจาก API คาดว่าจะมี { id, title, ... }
                const formattedExercises = response.data.data.map(item => ({
                    ...item,
                    title: item.title, // ใช้ title จาก API
                    // ดึงไอคอนจาก EXERCISE_ICONS โดยใช้ชื่อกีฬาเป็น key
                    icon: EXERCISE_ICONS[item.title] || EXERCISE_ICONS['อื่นๆ'], 
                }));

                setExercises(formattedExercises);
            }
        } catch (e) {
            console.error('Error fetching exercise list:', e);
            setError('ไม่สามารถดึงรายการออกกำลังกายได้ โปรดลองอีกครั้ง');
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อดึงรายการออกกำลังกายได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExerciseList();
    }, []);

    if (isLoading) {
        return (
            <AppBackground>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4299e1" />
                    <Text style={styles.loadingText}>กำลังดึงข้อมูลการออกกำลังกาย...</Text>
                </View>
            </AppBackground>
        );
    }

    if (error) {
        return (
            <AppBackground>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchExerciseList}>
                        <Text style={styles.retryButton}>ลองใหม่</Text>
                    </TouchableOpacity>
                </View>
            </AppBackground>
        );
    }
    
    return (
        <AppBackground>
            <BackButton navigation={navigation} />
            <NavBar navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>ออกกำลังกาย ({exercises.length} รายการ)</Text>

                        <ScrollView
                            contentContainerStyle={styles.gridContainer}
                            showsVerticalScrollIndicator={false}
                        >

                        <View style={styles.grid}>
                            {exercises.map((card, index) => (
                                <FeatureCard
                                    key={card.id || index}
                                    title={card.title}
                                    icon={card.icon}
                                    // colors={card.colors}
                                    onPress={() =>navigation.navigate('ExerciseDetail', { exercise: card })
                                    }
                                />
                            ))}
                        </View>
                        </ScrollView>
                    </View>
                </View>

            </ScrollView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end', 
        paddingBottom: 20,
    },
    
    // --- Speech Bubble Styles ---
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
        justifyContent: 'flex-start',
        overflow: 'hidden',
    },
    contentWrapper: {
        paddingHorizontal: 15,
        paddingTop: 30, 
        paddingBottom: 30, 
        flex: 1, 
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
    
    // --- Content Styles (อยู่ภายในกล่องขาว) ---
    greeting: {
        paddingBottom: 10,
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '700',
        color: '#333',
    },
    gridContainer: {
        flexGrow: 1, 
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    
    // --- Loading & Error Styles ---
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
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 15,
    },
    retryButton: {
        fontSize: 16,
        color: '#4299e1',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});