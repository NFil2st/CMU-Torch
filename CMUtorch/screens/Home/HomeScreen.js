import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FeatureCard from '../../components/common/Card';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
    const cards = [
        {
            title: 'Exercise',
            icon: '🏋️‍♂️',
            colors: ['#38beef', '#e894ff'],
            screen: 'ExerciseList'
        },
        {
            title: 'Nutrition',
            icon: '🥗',
            colors: ['#48ee6c', '#185a9d'],
            // screen: 'DietList'
        },
        {
            title: 'Mental',
            icon: '🧘‍♀️',
            colors: ['#fff7ad', '#ffa9f9'],
            // screen: 'MeditationList'
        },

        {
            title: 'Ranking',
            icon: '🏆',
            colors: ['#ff002bff', '#fff2c8ff'],
            // screen: 'SleepList'
        },
    ];
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.greeting}>โหมดใส่ใจ</Text>
            <Text style={styles.subtitle}>--------------</Text>

            <View style={styles.grid}>
                {cards.map((card, index) => (
                    <FeatureCard
                        key={index}
                        title={card.title}
                        icon={card.icon}
                        colors={card.colors}
                        onPress={() => navigation.navigate(card.screen)}
                    />
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 450,
        padding: 20,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: '700',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
