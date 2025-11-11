import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Card({ title, icon, colors, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <LinearGradient
                colors={colors || ['#fff', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.card}
            >
                <View style={styles.content}>
                    <Text style={styles.icon}>{icon}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
        height: 150,
        width: '48%',
    },
    card: {
        flex: 1,
        height: '100',
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
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
