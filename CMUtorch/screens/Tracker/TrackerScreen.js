import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ต้องใช้ component นี้สำหรับพื้นหลัง

const { width, height } = Dimensions.get('window');

// กำหนดข้อมูลการ์ด
const cards = [
    {
        title: 'เหนื่อยจัง',
        icon: '😩', // เปลี่ยนเป็น emoji ที่ใกล้เคียงในรูป (เช่น 😩 หรือ 😢)
        colors: ['#fff', '#fff'],
        screen: 'Home', // เปลี่ยนชื่อหน้าปลายทาง
    },
    {
        title: 'ก็สบายดี',
        icon: '😌',
        colors: ['#fff', '#fff'],
        screen: 'Home', // เปลี่ยนชื่อหน้าปลายทาง
    },
    {
        title: 'เยี่ยมเลย',
        icon: '😎',
        // colors ถูกกำหนดเป็นสีขาว แต่เราจะไม่ใช้ LinearGradient ในปุ่มแล้ว
        colors: ['#fff', '#fff'], 
        screen: 'Home', // เปลี่ยนชื่อหน้าปลายทาง
    },
];

export default function TrackerScreen({ navigation }) {
    return (
        // 1. ใช้ LinearGradient คลุมทั้งจอเพื่อทำพื้นหลังสีไล่โทน
        <LinearGradient
            colors={['#A6A7FF', '#C490D1']} // สีไล่โทนฟ้า-ม่วง-ชมพู (ปรับตามภาพจริง)
            style={styles.fullScreenBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* 2. กล่องข้อความหลัก (Speech Bubble) */}
                <View style={styles.speechBubble}>
                    
                    {/* 3. หางสามเหลี่ยมของกล่องข้อความ */}
                    <View style={styles.speechBubbleTail} />

                    {/* 4. เนื้อหาภายในกล่องข้อความ */}
                    <View style={styles.contentWrapper}>
                        <Text style={styles.greeting}>สวัสดี ช่วงนี้เป็นยังไงบ้าง ?</Text>

                        <View style={styles.grid}>
                            {cards.map((card, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate(card.screen)}
                                    // ปรับ style.wrapper ให้เน้นการจัดวางในแนวนอน
                                    style={styles.optionWrapper} 
                                >
                                    {/* 5. ใช้ View ธรรมดาแทน LinearGradient สำหรับปุ่ม */}
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
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        // จัดให้เนื้อหาไปอยู่ด้านล่างสุดของหน้าจอ
        justifyContent: 'flex-end', 
        paddingBottom: 20,
    },
    
    // --- Speech Bubble Styles ---
    speechBubble: {
        height: height * 0.5,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 30,
        // เพิ่มเงาให้ดูมีมิติ
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
        // สร้างสามเหลี่ยมชี้ขึ้นด้านบน
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
        borderBottomColor: 'white', // สีเดียวกับพื้นหลังของ bubble
    },
    
    // --- Content Styles ---
    greeting: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: '700',
        color: '#333',
        paddingBottom: 25,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between', // เว้นช่องไฟระหว่างปุ่ม
    },
    optionWrapper: {
        // คำนวณความกว้าง: (กว้างทั้งหมด - padding ด้านข้าง - ช่องว่างระหว่างปุ่ม) / 3
        width: (width - 40 - 20) / 3, 
        marginBottom: 0, // ลบ margin ล่างที่ไม่จำเป็น
        height: 'auto', // ไม่ต้องกำหนดความสูงคงที่
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
        fontSize: 20, // เพิ่มขนาด emoji
        marginBottom: 5,
    },
    title: {
        fontSize: 14, // เพิ่มขนาดตัวอักษร
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
});