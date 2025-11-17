import React from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackButton from '../../components/common/BackButton';

const foodData = {
    increase: [
        { id: 1, name: 'Lobster', image: require('../../assets/food/Robster.png') },
        { id: 2, name: 'Ratatuy', image: require('../../assets/food/Ratatuy.png') },
    ],
    decrease: [
        { id: 3, name: 'Salad', image: require('../../assets/food/Wagil.png') },
        { id: 4, name: 'Grilled Chicken', image: require('../../assets/food/Steck.png') },
    ],
};

export default function NutritionList({ route, navigation }) {
    const { type, title } = route.params;
    const foods = foodData[type] || [];

    const handleFoodPress = (food) => {
        navigation.navigate('CameraScreen', { food });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>{title}</Text>

            {foods.map((food) => (
                <TouchableOpacity
                    key={food.id}
                    style={styles.foodCard}
                    onPress={() => handleFoodPress(food)}
                >
                    <Image source={food.image} style={styles.foodImage} />
                    <Text style={styles.foodName}>{food.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
    },
    foodCard: {
        width: '100%',
        borderRadius: 15,
        backgroundColor: '#fff',
        marginBottom: 15,
        padding: 10,
        alignItems: 'center',
        elevation: 3,
    },
    foodImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
    },
    foodName: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
    },
});
