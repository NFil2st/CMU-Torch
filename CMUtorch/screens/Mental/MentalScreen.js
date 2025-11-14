import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/MentalCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function MentalScreen ({ navigation }) {
    const cards = [
        {
            title: 'วันนี้รู้สึกว่าไม่อยากทำอะไรเลย',
            colors: ['#f24242', '#e894ff'],
            screen: 'MentalScreenSecond'
        },
        {
            title: 'วันนี้รู้สึกมีแรงและมีกำลังใจจะทำสิ่งต่าง ๆ',
            colors: ['#fff7ad', '#ffa9f9'],
            screen: 'MentalScreenSecond'
        },
        {
            title: 'วันนี้หัวเราะหรือยิ้มด้วย',
            colors: ['#38beef', '#e894ff'],
            screen: 'MentalScreenSecond'
        },
        {
            title: 'วันนี้รู้สึกภูมิใจกับสิ่งที่ตัวเองทำ',
            colors: ['#48ee6c', '#e894ff'],
            screen: 'MentalScreenSecond'
        },
    ];
    
    return (<AppBackground>
            <BackButton navigation={navigation} />
            <NavBar navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.speechBubble}>
                    
                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        
                        <Text style={styles.greeting}>คำถามแรกน้า</Text>

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