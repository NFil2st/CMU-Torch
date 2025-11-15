import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/MentalCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function MentalScreenSecond ({ navigation }) {
    const cards = [
        {
            title: 'วันนี้รู้สึกโดดเดี่ยวหรือไม่มีเข้าใจ',
            colors: ['#f24242', '#e894ff'],
            screen: 'MentalNegative'
        },
        {
            title: 'วันนี้ได้ระบายหรือแชร์ความรู้สึกกับใครสักคน ๆ',
            colors: ['#fff7ad', '#ffa9f9'],
            screen: 'MentalNegative'
        },
        {
            title: 'วันนี้รู้สึกได้รับความอบอุ่นจากคนรอบข้าง',
            colors: ['#38beef', '#e894ff'],
            screen: 'MentalPositive'
        },
        {
            title: 'วันนี้ได้ให้กำลังใจหรือให้รอยยิ้มกับใครมั้ย',
            colors: ['#48ee6c', '#e894ff'],
            screen: 'MentalPositive'
        },
    ];
    
    return (<AppBackground>
            <BackButton navigation={navigation} />
            <NavBar navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>คำถามแรกสุดท้ายน้า</Text>

                        <View style={styles.grid}>
                            {cards.map((card, index) => (
                                <FeatureCard
                                    key={index}
                                    title={card.title}
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
        justifyContent: 'flex-end', 
    },
    
    speechBubble: {
        backgroundColor: '#fff',
        borderRadius: 30,
        height: height * 0.5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
        justifyContent: 'flex-start',
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
    
    greeting: {
        paddingBottom: 10,
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '700',
        color: '#333',
    },
    grid: {
        paddingTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});