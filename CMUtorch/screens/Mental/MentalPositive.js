import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/SumMentalCard';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function MentalPositive({ navigation }) {
    const cards = [
        {
            icon: '💫',
            title: 'วันนี้แกดูสดใสและแฮปปี้มากเลยเก่งมากที่ดูแลใจตัวเองได้ดีแบบนี้ 💖',
            colors: ['#ffffff', '#ffffff'],
            screen: 'Home'
        },
    ];

    return (<AppBackgroundWithMascot>
        <BackButton navigation={navigation} />
        <NavBar navigation={navigation} />

        <ScrollView contentContainerStyle={styles.scrollContent}>

            <View style={styles.speechBubble}>

                <View style={styles.speechBubbleTail} />

                <View style={styles.contentWrapper}>

                    <View style={styles.grid}>
                        {cards.map((card, index) => (
                            <FeatureCard
                                key={index}
                                icon={card.icon}
                                title={card.title}
                                colors={card.colors}
                                onPress={() => card.screen && navigation.navigate(card.screen)}
                            />
                        ))}
                    </View>
                </View>
            </View>

        </ScrollView>
    </AppBackgroundWithMascot>
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
        top: -14,
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
    grid: {
        paddingTop: 20,
        alignItems: 'center',
    },
});