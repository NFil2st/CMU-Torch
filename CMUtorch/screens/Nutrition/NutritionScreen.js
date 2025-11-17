import React from 'react';
import { View, ScrollView, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ExerciseRecommendationScreen({ navigation }) {

  const categories = [
{ id: 1, title: 'เพิ่มน้ำหนัก', colors: ['#f24242', '#e894ff'], screen: 'NutritionList', type: 'increase' },
{ id: 2, title: 'ลดน้ำหนัก', colors: ['#48ee6c', '#e894ff'], screen: 'NutritionList', type: 'decrease' },

  ];

  const recommendedFoods = [
    { id: 1, name: 'Lobster', image: require('../../assets/food/Robster.png') },
    { id: 2, name: 'Ratatuy', image: require('../../assets/food/Ratatuy.png') },
    { id: 3, name: 'Salmon', image: require('../../assets/food/Ratatuy.png') },
  ];

  return (
    <AppBackgroundWithMascot>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.speechBubble}>
          <View style={styles.speechBubbleTail} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.innerScroll}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={styles.contentWrapper}>
              
              <Text style={styles.title}>อยากเลือกอาหารให้เหมาะกับคุณไหม?</Text>
              <Text style={styles.subtitle}>เลือกหมวดหมู่อาหารที่ต้องการ!</Text>

              {/* หมวดหมู่อาหาร */}
              <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.horizontalScroll}
  contentContainerStyle={{ paddingHorizontal: 15 }}
>
             {categories.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={styles.cardWrapper}
    onPress={() =>
      navigation.navigate(item.screen, {
        id: item.id,
        title: item.title,
        colors: item.colors,
        type: item.type,
      })
    }
  >
    <LinearGradient
      colors={item.colors}
      style={styles.categoryCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
    </LinearGradient>
  </TouchableOpacity>
))}
</ScrollView>


              <Text style={styles.subtitle}>อาหารแนะนำสำหรับคุณ</Text>

              {/* อาหารแนะนำ */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {recommendedFoods.map((item) => (
                  <View key={item.id} style={styles.foodCard}>
                    <Image source={item.image} style={styles.foodImage} />
                    <Text style={styles.foodName}>{item.name}</Text>
                  </View>
                ))}
              </ScrollView>

            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </AppBackgroundWithMascot>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },

cardWrapper: {
  marginRight: 15,
},

categoryCard: {
  height: 50,
  width: 200,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 15,
},

cardTitle: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '800',
  textAlign: 'center',
},


  /* Base White Speech Bubble */
  speechBubble: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    height: height * 0.55,       // เพิ่มความสูง 55% ของจอ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 8,
    paddingTop: 20,
  },

  speechBubbleTail: {
    position: 'absolute',
    top: -15,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },

  innerScroll: {
    flex: 1,
    paddingHorizontal: 15,
  },

  contentWrapper: {
    paddingTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    paddingBottom: 6,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 15,
    color: '#444',
  },

  horizontalScroll: {
    marginBottom: 25,
  },

  foodCard: {
    height: 150,
    width: 160,
    backgroundColor: '#fff',
    marginRight: 12,
    padding: 10,
  },

  foodImage: {
    width: '100%',
    height: '75%',
    borderRadius: 12,
    resizeMode: 'cover',
  },

  foodName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
