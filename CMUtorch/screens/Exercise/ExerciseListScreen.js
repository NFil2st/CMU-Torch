import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const exercises = [
    { id: '1', name: 'Running', duration: '30 mins', calories: 250 },
    { id: '2', name: 'Yoga', duration: '20 mins', calories: 120 },
    { id: '3', name: 'Cycling', duration: '45 mins', calories: 400 },
];

export default function ExerciseListScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏋️ Exercise List</Text>

            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
                    >
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.info}>
                            {item.duration} | {item.calories} kcal
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 3 },
    name: { fontSize: 18, fontWeight: '600' },
    info: { color: '#555' },
});
