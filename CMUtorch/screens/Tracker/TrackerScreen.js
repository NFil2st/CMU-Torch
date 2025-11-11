import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrackerScreen({ navigation }) {
    const cards = [
        {
            title: 'เยี่ยมเลย',
            icon: '😎',
            colors: ['#fff', '#fff'],
            screen: 'Home',
        },
        {
            title: 'ก็สบายดี',
            icon: '😌',
            colors: ['#fff', '#fff'],
            screen: 'Home',
        },
        {
            title: 'เหนื่อยจุง',
            icon: '😢',
            colors: ['#fff', '#fff'],
            screen: 'Home',
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.greeting}>สวัสดี ช่วงนี้เป็นยังไงบ้าง ?</Text>

            <View style={styles.grid}>
                {cards.map((card, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(card.screen)}
                        style={styles.wrapper}
                    >
                        <LinearGradient
                            colors={card.colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.card}
                        >
                            <View style={styles.content}>
                                <Text style={styles.icon}>{card.icon}</Text>
                                <Text style={styles.title}>{card.title}</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
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
        fontSize: 20,
        textAlign: 'left',
        fontWeight: '700',
        color: '#333',
        paddingBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    wrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
        height: 100,
        width: '25%',
    },
    card: {
        flex: 1,
        width: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    content: {
        alignItems: 'center',
    },
    icon: {
        fontSize: 40,
        marginBottom: 8,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000ff',
    },
});
