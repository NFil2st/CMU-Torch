import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function NutritionCategoryCard({ title, colors, onPress }) {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <View style={[styles.card, { backgroundColor: colors[0] }]}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '48%',
        height: 120,
        borderRadius: 20,
        marginBottom: 15,
        overflow: 'hidden',
    },
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },
});
