import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/ExerciseCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';

const { width, height } = Dimensions.get('window'); // ดึงความสูงของหน้าจอมาใช้

export default function ExerciseListScreen({ navigation }) {

const exercises = [
  { title: 'บาสเกตบอล', icon: '🏀' },
  { title: 'ฟุตบอล', icon: '⚽' },
  { title: 'วอลเล่บอล', icon: '🏐' },
  { title: 'ว่ายน้ำ', icon: '🏊‍♂️' },
  { title: 'วิ่ง', icon: '🏃‍♂️' },
  { title: 'จักรยาน', icon: '🚴‍♂️' },
  { title: 'โยคะ', icon: '🧘‍♂️' },
  { title: 'ฟิตเนส', icon: '🏋️‍♂️' },
];
    
    return (<AppBackground>
            <BackButton navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* กล่องข้อความหลัก (Speech Bubble) ถูกกำหนดความสูง 50% ที่นี่ */}
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>ออกกำลังกาย</Text>

                        <View style={styles.grid}>
                            {exercises.map((card, index) => (
                                <FeatureCard
                                    key={index}
                                    title={card.title}
                                    icon={card.icon}
                                    colors={card.colors}
                                    onPress={() => card.screen && navigation.navigate(card.screen)}
                                />
                            ))}
                        </View>
                    </View>
                </View>

            </ScrollView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        // ทำให้เนื้อหาสามารถดันไปด้านล่างได้
        justifyContent: 'flex-end', 
        paddingBottom: 20,
    },
    
    // --- Speech Bubble Styles ---
    speechBubble: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 30,
        // *** การเปลี่ยนแปลงหลัก: กำหนดความสูง 50% ของความสูงหน้าจอ ***
        height: height * 0.7, 
        // -----------------------------------------------------------
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
        // ใช้ flex เพื่อจัดการเนื้อหาภายใน speechBubble
        justifyContent: 'flex-start',
    },
    contentWrapper: {
        paddingHorizontal: 15,
        paddingTop: 30, 
        paddingBottom: 30, 
        flex: 1, // ทำให้เนื้อหาเต็มพื้นที่ที่เหลือใน speechBubble
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});