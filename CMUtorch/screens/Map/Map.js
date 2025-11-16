import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const mockUserLocation = {
    latitude: 18.78807,
    longitude: 98.95244,
};

const destination = {
    latitude: 18.79808031685481,
    longitude: 98.95189633716744,
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2); // km
};

export default function Map() {
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const d = calcDistance(
            mockUserLocation.latitude,
            mockUserLocation.longitude,
            destination.latitude,
            destination.longitude
        );
        setDistance(d);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📍 ระยะทาง</Text>

            <LinearGradient
                colors={["#f7e1ff", "#e9d1ff", "#d7b3ff"]}
                style={styles.card}
            >
                <Text style={styles.kmNumber}>{distance ? distance : "--"}</Text>
                <Text style={styles.kmLabel}>kilometers away</Text>
            </LinearGradient>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    {/* 🧭 From: {mockUserLocation.latitude}, {mockUserLocation.longitude} */}
                    🧭 จากตำแหน่งปัจจุบัน
                </Text>
                <Text style={styles.infoText}>
                    {/* 🎯 To: {destination.latitude}, {destination.longitude} */}
                    🎯 ไปยังจุดหมาย
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: "#ffffff",
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        marginTop: 40,
        marginBottom: 30,
        color: "#3a0066",
    },
    card: {
        width: "100%",
        height: 200,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    kmNumber: {
        fontSize: 62,
        fontWeight: "800",
        color: "#3b0069",
    },
    kmLabel: {
        fontSize: 20,
        marginTop: 5,
        color: "#4c0078",
        opacity: 0.7,
    },
    infoBox: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "#faf5ff",
        borderRadius: 16,
    },
    infoText: {
        textAlign: "center",
        fontSize: 15,
        color: "#5c008a",
        marginBottom: 5,
    },
});
