import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AppBackground from '../../components/common/AppBackground';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';

const screenWidth = Dimensions.get('window').width;

export default function SummarizeScreen({ navigation }) {
  // =============== MOCK DATA ===============
  const dailyEmotions = [3, 4, 2, 5, 4, 1, 3]; // 7 วัน
  const avgWeek = dailyEmotions.reduce((a, b) => a + b, 0) / dailyEmotions.length;

  const weeklyEmotions = [avgWeek, 3.5, 4.2, 2.8];
  const avgMonth = weeklyEmotions.reduce((a, b) => a + b, 0) / weeklyEmotions.length;

  // =============== CHART DATA ===============
  const dailyChartData = {
    labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
    datasets: [{ data: dailyEmotions }],
  };

  const weeklyChartData = {
    labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
    datasets: [{ data: weeklyEmotions }],
  };

  const monthlyChartData = {
    labels: ['เดือนนี้'],
    datasets: [{ data: [avgMonth] }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(166, 109, 187, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 1,
  };

  return (
    <AppBackground>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      {/* กรอบสีขาวด้านล่าง */}
      <View style={styles.whiteContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>สรุปผลอารมณ์</Text>

          {/* ==== รายวัน ==== */}
          <Text style={styles.sectionTitle}>รายวัน</Text>
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
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />

          {/* ==== รายเดือน ==== */}
          <Text style={styles.sectionTitle}>รายเดือน</Text>
          <BarChart
            data={monthlyChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />

          <Text style={styles.summaryText}>
            ค่าเฉลี่ยรายวัน: {avgWeek.toFixed(2)} {'\n'}
            ค่าเฉลี่ยรายเดือน: {avgMonth.toFixed(2)}
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
