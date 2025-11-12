import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/Card';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';

const { width, height } = Dimensions.get('window'); // ดึงความสูงของหน้าจอมาใช้

export default function HomeScreen({ navigation }) {
    const cards = [
        {
            title: 'ออกกำลังกาย',
            icon: '🏋️‍♂️',
            colors: ['#38beef', '#e894ff'],
            screen: 'ExerciseList'
        },
        {
            title: 'อาหาร',
            icon: '🥗',
            colors: ['#48ee6c', '#185a9d'],
            //screen: 'DietList' 
        },
        {
            title: 'สุขภาพจิต',
            icon: '🧘‍♀️',
            colors: ['#eabf33ff', '#ffa9f9'],
            //screen: 'MeditationList' 
        },
        {
            title: 'อันดับ',
            icon: '🏆',
            colors: ['#ff002bff', '#f5da80ff'],
            //screen: 'Rankings' 
        },
    ];
    
    return (<AppBackground>
            <BackButton navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* กล่องข้อความหลัก (Speech Bubble) ถูกกำหนดความสูง 50% ที่นี่ */}
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>โหมดใส่ใจ</Text>

                        <View style={styles.grid}>
                            {cards.map((card, index) => (
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
        height: height * 0.5, 
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