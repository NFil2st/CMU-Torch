import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import FeatureCard from '../../components/common/NutritionCard';
import BackButton from '../../components/common/BackButton';
import AppBackground from '../../components/common/AppBackground';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function NutritionScreen({ navigation }) {

    const foods = [
        { id: 1, name: 'Lobster', image: require('../../assets/Robster.png') },
        { id: 2, name: 'Ratatuy', image: require('../../assets/Ratatuy.png') },
    ];
    const cards = [
        {
            title: 'เพิ่มน้ำหนัก',
            colors: ['#f24242', '#e894ff'],
            screen: 'NutritionIncrease'
        },
        {
            title: 'ลดน้ำหนัก',
            colors: ['#48ee6c', '#e894ff'],
            screen: 'NutritionDecrease'
        },
    ];

    return (<AppBackground>
        <BackButton navigation={navigation} />
        <NavBar navigation={navigation} />

        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.speechBubble}>
                <View style={styles.speechBubbleTail} />
                <View style={styles.contentWrapper}>

                    <Text style={styles.greeting}>เวลามีอารมณ์ดี </Text>
                    <Text style={styles.greeting}>รสจัดจะยิ่งฟินและอร่อย!</Text>
                    <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
                        {foods.map((item) => (
                            <View key={item.id} style={styles.foodCard}>
                                <Image source={item.image} style={styles.foodImage} />
                                <Text style={styles.foodName}>{item.name}</Text>
                            </View>
                        ))}
                    </ScrollView>

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
    container: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
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
        height: height * 0.48,
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
        textAlign: 'start',
        paddingBottom: 10,
        paddingRight: 50,
        fontSize: 17,
        fontWeight: '700',
        color: '#333',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    foodScroll: {
        width: '100%',
        paddingHorizontal: 9,
    },
    foodCard: {
        height: 250,
        width: 260,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 12,
        padding: 10,
        elevation: 3,
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