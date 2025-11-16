import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';

const { width, height } = Dimensions.get('window');

const cards = [
    {
        title: 'เหนื่อยจัง',
        icon: '😩',
        colors: ['#fff', '#fff'],
        screen: 'Home',
    },
    {
        title: 'ก็สบายดี',
        icon: '😌',
        colors: ['#fff', '#fff'],
        screen: 'Home',
    },
    {
        title: 'เยี่ยมเลย',
        icon: '😎',
        colors: ['#fff', '#fff'],
        screen: 'Home',
    },
];

export default function TrackerScreen({ navigation }) {
    return (
        <AppBackgroundWithMascot>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.speechBubble}>

                    <View style={styles.speechBubbleTail} />

                    <View style={styles.contentWrapper}>
                        <Text style={styles.greeting}>สวัสดี ช่วงนี้เป็นยังไงบ้าง ?</Text>

                        <View style={styles.grid}>
                            {cards.map((card, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate(card.screen)}
                                    style={styles.optionWrapper}
                                >
                                    <View style={styles.card}>
                                        <View style={styles.content}>
                                            <Text style={styles.icon}>{card.icon}</Text>
                                            <Text style={styles.title}>{card.title}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

            </ScrollView>
        </AppBackgroundWithMascot>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },

    speechBubble: {
        height: height * 0.5,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    contentWrapper: {
        paddingHorizontal: 15,
        paddingTop: 25,
        paddingBottom: 20,
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
        fontSize: 20,
        textAlign: 'left',
        fontWeight: '700',
        color: '#333',
        paddingBottom: 25,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionWrapper: {
        width: (width - 40 - 20) / 3,
        marginBottom: 0,
        height: 'auto',
    },
    // card: {
    //     // ใช้ View ธรรมดาแทน LinearGradient
    //     flex: 1,
    //     width: '100%',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    content: {
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        marginBottom: 5,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
});