import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import AppBackgroundRank from '../../components/common/AppBackgroundRank';

const { width, height } = Dimensions.get('window');

export default function RankingScreen({ navigation }) {
    const users = [
        { name: 'ผู้กองยอดรัก', faculty: 'CAMT', stack: 85 },
        { name: 'แว่นมานี่มา', faculty: 'เทคนิคการแพทย์', stack: 61 },
        { name: 'เผือกบดเลิฟเว่อ', faculty: 'เกษตร', stack: 55 },
        { name: 'ติ๋มอย่าทิ้งเค้า', faculty: 'นิติศาสตร์', stack: 27 },
        { name: 'เทสระบบจีน', faculty: 'CAMT', stack: 9 },
    ];

    return (
        <AppBackgroundRank>
            <BackButton navigation={navigation} />
            <NavBar navigation={navigation} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Stack</Text>
                    <Text style={styles.stackCount}>8</Text>
                </View>

                <View style={styles.container}>
                    <View style={styles.speechBubble}>
                        <View style={styles.contentWrapper}>
                            <Text style={styles.rankingsTitle}>Top 5</Text>

                            {users.map((user, index) => (
                                <View style={styles.rankCard} key={index}>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.rankName}>NAME : {user.name}</Text>
                                        <Text style={styles.rankFaculty}>คณะ : {user.faculty}</Text>
                                    </View>

                                    <Text style={styles.rankStack}>{user.stack}</Text>
                                    <Text style={styles.rankIcon}>🔥</Text>

                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </AppBackgroundRank>
    );
}


const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    speechBubble: {
        backgroundColor: '#fff',
        // marginHorizontal: 20,
        borderRadius: 30,
        height: height * 0.60,
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
    header: {
        paddingTop: 80,
        alignItems: 'center',
        marginVertical: 30,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000ff',
    },

    stackCount: {
        fontSize: 40,
        fontWeight: '700',
        color: '#000000ff',
        marginTop: 10,
    },

    rankingsTitle: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '900',
        color: '#000000ff',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    rankCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 12,
    },

    rankIcon: {
        fontSize: 35,
        marginRight: 12,
    },
    rankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    rankFaculty: {
        fontSize: 14,
        color: '#777',
    },

    rankStack: {
        marginLeft: 'auto',
        fontSize: 16,
        fontWeight: '700',
        color: '#ff8c00',
    },
});