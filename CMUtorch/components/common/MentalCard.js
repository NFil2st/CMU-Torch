import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Card({ title, colors, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const darkAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.99,
                useNativeDriver: true,
            }),
            Animated.timing(darkAnim, {
                toValue: 0.2,
                duration: 120,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(darkAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.wrapper}
        >
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
                <LinearGradient
                    colors={colors}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                    style={styles.card}>

                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <Animated.View
                        style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: 'black', opacity: darkAnim, borderRadius: 20 },
                        ]}
                    />
                </LinearGradient>
            </Animated.View>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 10,
        width: '48%',
        height: 120,
    },
    card: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000ff',
        textAlign: 'center',
        alignSelf: 'center',
    },
});
