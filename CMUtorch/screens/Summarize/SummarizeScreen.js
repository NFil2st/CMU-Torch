import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;
const screenWidth = Dimensions.get('window').width;

export default function SummarizeScreen({ navigation }) {
  const [dailyHistory, setDailyHistory] = useState({});
  const [daily7, setDaily7] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weekAvg, setWeekAvg] = useState(0);
  const [monthAvg, setMonthAvg] = useState(0);

  // ==========================
  // ฟังก์ชัน fetch data จาก backend
  // ==========================
  const fetchMoods = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const res = await fetch(`${API_URL}/api/get-moods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('Mood API:', data);
      return data;
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  // ==========================
  // โหลดข้อมูลตอน mount
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMoods();
      if (data.success) {
        setDailyHistory(data.dailyMoodHistory || {});
        setWeekAvg(data.moodweek || 0);
        setMonthAvg(data.moodmonth || 0);
      }
    };
    loadData();
  }, []);

  // ==========================
  // คำนวณ daily7 ทุกครั้งที่ dailyHistory เปลี่ยน
  // ==========================
  useEffect(() => {
    const getDailyLast7Days = () => {
      const today = new Date();
      const last7 = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);

        if (dailyHistory[key] && dailyHistory[key].length > 0) {
          const avg =
            dailyHistory[key].reduce((a, b) => a + b, 0) /
            dailyHistory[key].length;
          last7.push(avg);
        } else {
          last7.push(0);
        }
      }

      return last7;
    };

    setDaily7(getDailyLast7Days());
  }, [dailyHistory]);

  // ==========================
  // กำหนด chart data
  // ==========================
  const dailyChartData = {
    labels: ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'],
    datasets: [{ data: daily7 }],
  };

  const weeklyChartData = {
    labels: ['ค่าเฉลี่ยล่าสุด'],
    datasets: [{ data: [weekAvg] }],
  };

  const monthlyChartData = {
    labels: ['เดือนนี้'],
    datasets: [{ data: [monthAvg] }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(166, 109, 187, ${opacity})`,
    labelColor: () => '#333',
    decimalPlaces: 1,
    barPercentage: 0.5,
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <View style={styles.whiteContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>สรุปผลอารมณ์</Text>

          {/* ==== รายวัน ==== */}
          <Text style={styles.sectionTitle}>รายวัน (ย้อนหลัง 7 วัน)</Text>
          <BarChart
            data={dailyChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />

          {/* ==== รายสัปดาห์ ==== */}
          <Text style={styles.sectionTitle}>รายสัปดาห์</Text>
          <BarChart
            data={weeklyChartData}
            width={screenWidth - 60}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />

          {/* ==== รายเดือน ==== */}
          <Text style={styles.sectionTitle}>รายเดือน</Text>
          <BarChart
            data={monthlyChartData}
            width={screenWidth - 60}
            height={180}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />

          <Text style={styles.summaryText}>
            ค่าเฉลี่ยรายสัปดาห์: {weekAvg.toFixed(2)} {'\n'}
            ค่าเฉลี่ยรายเดือน: {monthAvg.toFixed(2)}
          </Text>
        </ScrollView>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  whiteContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#A66DBB',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  summaryText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
