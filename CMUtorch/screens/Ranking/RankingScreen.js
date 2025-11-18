import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import BackButton from '../../components/common/BackButton';
import NavBar from '../../components/common/NavBar';
import AppBackgroundRank from '../../components/common/AppBackgroundRank';
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const { width, height } = Dimensions.get('window');

// -------------------- FETCH STACK FROM BACKEND --------------------
async function getStack(type) {
  try {
    const res = await fetch(`${API_URL}/api/getStack?type=${type}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch stack");
    return json.data;
  } catch (err) {
    console.error("getStack error:", err);
    return [];
  }
}

export default function RankingScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [type, setType] = useState("food"); // "food" | "exercise"
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลเมื่อเปิดหน้า หรือเปลี่ยน type
  useEffect(() => {
    loadRanking();
  }, [type]);

  const loadRanking = async () => {
    setLoading(true);
    const data = await getStack(type);
    setUsers(data);
    setLoading(false);
  };

  return (
    <AppBackgroundRank>
      <BackButton navigation={navigation} />
      <NavBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Stack</Text>
          <Text style={styles.stackCount}>8</Text>
        </View>

        {/* STACK LIST */}
        <View style={styles.container}>
          <View style={styles.speechBubble}>
            <View style={styles.contentWrapper}>
                      {/* TYPE SELECTOR */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            onPress={() => setType("food")}
            style={[styles.typeButton, type === "food" && styles.typeButtonActive]}
          >
            <Text style={styles.typeText}>🍔 Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType("exercise")}
            style={[styles.typeButton, type === "exercise" && styles.typeButtonActive]}
          >
            <Text style={styles.typeText}>🏋️ Exercise</Text>
          </TouchableOpacity>
        </View>
              <Text style={styles.rankingsTitle}>
                Top 5 {type === "food" ? "Food" : "Exercise"}
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#ff8c00" />
              ) : (
                users.map((user, index) => (
                  <View style={styles.rankCard} key={index}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rankName}>NAME : {user.name}</Text>
                      <Text style={styles.rankFaculty}>คณะ : {user.faculty}</Text>
                    </View>

                    <Text style={styles.rankStack}>{user.stack}</Text>
                    <Text style={styles.rankIcon}>🔥</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </AppBackgroundRank>
  );
}

// -------------------- STYLE --------------------
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  header: {
    paddingTop: 80,
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  stackCount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    marginTop: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  typeButtonActive: {
    backgroundColor: '#ffbe76',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  speechBubble: {
    backgroundColor: '#fff',
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
  rankingsTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
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
  rankIcon: {
    fontSize: 35,
    marginLeft: 10,
  },
});
