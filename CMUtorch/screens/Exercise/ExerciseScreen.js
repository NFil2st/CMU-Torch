import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/Recommen';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';

const { width, height } = Dimensions.get('window');

export default function ExerciseScreen({ navigation }) {
    const cards = [
        {
            title: 'ออกกำลังกายที่เหมาะสมสำหรับคุณ',
            icon: '♥',
            colors: ['#38beef', '#e894ff'],
            screen: 'ExerciseRecommendation'
        },
        {
            title: 'ประเภทการออกกำลังกาย',
            icon: '🏀',
            colors: ['#38beef', '#e894ff'],
            screen: 'ExerciseList'
        },
    ];
    
    return (<AppBackground>
            <BackButton navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>ออกกำลังกาย</Text>

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
        justifyContent: 'flex-end', 
        paddingBottom: 20,
    },
    
    speechBubble: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});