import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, Dimensions } from 'react-native';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';
import NutritionCategoryCard from '../../components/common/NutritionCategoryCard';

const { height } = Dimensions.get('window');

export default function NutritionScreen({ navigation }) {
    // หมวดหมู่โภชนาการ
    const categories = [
        { id: 1, title: 'เพิ่มน้ำหนัก', colors: ['#f24242', '#e894ff'], screen: 'NutritionList', type: 'increase' },
        { id: 2, title: 'ลดน้ำหนัก', colors: ['#48ee6c', '#e894ff'], screen: 'NutritionList', type: 'decrease' },
    ];

    // อาหารแนะนำ
    const recommendedFoods = [
        { id: 1, name: 'Lobster', image: require('../../assets/food/Robster.png') },
        { id: 2, name: 'Ratatuy', image: require('../../assets/food/Ratatuy.png') },
        { id: 3, name: 'Salmon', image: require('../../assets/food/Ratatuy.png') },
    ];

   return (
    <AppBackgroundWithMascot>
        <BackButton navigation={navigation} />
        <NavBar navigation={navigation} />

        <ScrollView style={styles.container}>
            {/* --- Speech Bubble (อาหารแนะนำ + หมวดหมู่) --- */}
            <View style={styles.speechBubble}>
                <View style={styles.speechBubbleTail} />

                <View style={styles.contentWrapper}>
                    {/* แนะนำอาหาร */}
                    <Text style={styles.greeting}>เวลามีอารมณ์ดี</Text>
                    <Text style={styles.greeting}>รสจัดจะยิ่งฟินและอร่อย!</Text>
                    <ScrollView
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.foodScroll}
                    >
                        {recommendedFoods.map((item) => (
                            <View key={item.id} style={styles.foodCard}>
                                <Image source={item.image} style={styles.foodImage} />
                                <Text style={styles.foodName}>{item.name}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* --- หมวดหมู่โภชนาการ --- */}
                    <View style={styles.categoriesContainer}>
                        {categories.map((cat) => (
                            <NutritionCategoryCard
                                key={cat.id}
                                title={cat.title}
                                colors={cat.colors}
                                onPress={() =>
                                    navigation.navigate(cat.screen, { type: cat.type, title: cat.title })
                                }
                            />
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    </AppBackgroundWithMascot>
);
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },

    // --- Speech Bubble ---
    speechBubble: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        height: height * 0.5, // กรอบสีขาวอยู่ด้านล่าง 50% ของหน้าจอ
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
        overflow: 'hidden',
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
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

    // --- Greeting / แนะนำอาหาร ---
    greeting: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    foodScroll: {
        marginBottom: 15,
    },
    foodCard: {
        width: 140,
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 12,
        padding: 10,
        elevation: 2,
        alignItems: 'center',
    },
    foodImage: {
        width: '100%',
        height: '75%',
        borderRadius: 10,
    },
    foodName: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

    // --- Categories ---
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});