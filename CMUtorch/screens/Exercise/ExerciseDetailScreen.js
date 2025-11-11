import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ExerciseDetailScreen({ route, navigation }) {
    const { exercise } = route.params; // รับข้อมูลจากหน้า List

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.text}>Duration: {exercise.duration}</Text>
            <Text style={styles.text}>Calories Burned: {exercise.calories} kcal</Text>

            <Button title="Start Exercise" onPress={() => alert('Let’s go! 💪')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
    text: { fontSize: 18, marginBottom: 5 },
});
