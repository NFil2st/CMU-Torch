import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import FeatureCard from '../../components/common/NutritionCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function NutritionIncrease({ navigation }) {

    const foods = [
        { id: 1, name: 'Lobster', image: require('../../assets/Robster.png') },
        { id: 2, name: 'Ratatuy', image: require('../../assets/Ratatuy.png') },
        { id: 3, name: 'Steck', image: require('../../assets/Steck.png') },
        { id: 4, name: 'Wagil', image: require('../../assets/Wagil.png') },
        // { id: 5, name: 'Omlet', image: require('../../assets/Omlet.jpg') },
    ];
    const cards = [
        {
            title: 'หมวดหมู่เพิ่มน้ำหนัก',
            colors: ['#48ee6c', '#e894ff'],
            screen: 'NutritionIncrease'
        },
    ];

    return (<AppBackground>
        <BackButton navigation={navigation} />
        <NavBar navigation={navigation} />

        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.speechBubble}>
                <View style={styles.contentWrapper}>

                    <Text style={styles.greeting}>วันนี้อยากลดน้ำหนักหรอ </Text>

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

                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true} style={styles.foodScroll}>
                        {foods.map((item) => (
                            <View key={item.id} style={styles.foodCard}>
                                <Image source={item.image} style={styles.foodImage} />
                                <Text style={styles.foodName}>{item.name}</Text>
                            </View>
                        ))}
                    </ScrollView>

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
    container: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },

    speechBubble: {
        backgroundColor: '#fff',
        borderRadius: 30,
        height: height * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
        justifyContent: 'flex-end',
    },
    contentWrapper: {
        paddingHorizontal: 15,
        paddingTop: 30,
        paddingBottom: 30,
        flex: 1,
    },
    greeting: {
        textAlign: 'start',
        paddingBottom: 10,
        paddingRight: 50,
        fontSize: 19,
        fontWeight: '700',
        color: 'rgba(0, 0, 0, 1)',
    },
    grid: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    foodScroll: {
        width: '100%',
        paddingHorizontal: 9,
    },
    foodCard: {
        height: 210,
        width: 260,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 12,
        padding: 10,
        elevation: 3,
        marginBottom: 12,
    },
    foodImage: {
        width: '100%',
        height: '80%',
        borderRadius: 10,
    },
    foodName: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
        textAlign: 'center',
    },
});