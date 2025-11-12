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
        height: 120,
    },
    card: {
        flex: 1,
        height: '100%',
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
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
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
