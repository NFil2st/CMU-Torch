// EventScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  FlatList,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// วันที่จริงงานรับน้องขึ้นดอยสุเทพ
const EVENT_DATE = new Date("2025-11-22T04:30:00");

// กิจกรรมตัวอย่าง
const sampleEvents = [
  {
    id: '1',
    title: 'รวมพลขึ้นดอยสุเทพ',
    time: '22 พฤศจิกายน 2025 — 04:30 น.',
    location: 'ลานหน้ามหาวิทยาลัย',
    short: 'เดินขึ้นดอยชมวิวพระอาทิตย์ขึ้น พร้อมกิจกรรมรับน้อง',
    details:
      'เตรียมไฟฉาย รองเท้าเดินป่า น้ำดื่ม รวมตัวหน้ามหาวิทยาลัย 04:30 น. รถรับส่งมีจำนวนจำกัด',
  },
  {
    id: '2',
    title: 'ค่ายทีมบู๊ทเปิดต้อนรับ',
    time: '22 พฤศจิกายน 2025 — 07:30 น.',
    location: 'ลานกิจกรรมดอยสุเทพ',
    short: 'กิจกรรมเปิดตัวชมรม แจกของที่ระลึก และประกวดเชียร์',
    details:
      'กิจกรรมแนะนำชมรม แข่งเชียร์สุดมันส์ รางวัลชมรมยอดเยี่ยมพร้อมของขวัญสุดพิเศษ',
  },
];

export default function EventScreen({ navigation }) {
  const [countdown, setCountdown] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ⏳ Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = EVENT_DATE - now;

      if (diff <= 0) {
        setCountdown("เริ่มกิจกรรมแล้ว!");
        clearInterval(timer);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown(`${d} วัน ${h} ชม ${m} นาที ${s} วินาที`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // เปิดรายละเอียด
  function openDetails(item) {
    setSelected(item);
    setModalVisible(true);
  }

  // ปิดรายละเอียด
  function closeDetails() {
    setSelected(null);
    setModalVisible(false);
  }

  // Render event card
  function renderItem({ item }) {
    return (
      <Pressable style={styles.card} onPress={() => openDetails(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>

        <Text style={styles.cardShort}>{item.short}</Text>

        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} />
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>

          <Pressable
            style={styles.rsvpButton}
            onPress={() => alert("ลงทะเบียนเรียบร้อย!")}
          >
            <Text style={styles.rsvpText}>RSVP</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/Mascot/event/torch_event.png')}
      style={styles.background}
    >
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.65)",
          "rgba(0,0,0,0.30)",
          "rgba(0,0,0,0.65)",
        ]}
        style={styles.gradient}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </Pressable>

          <Text style={styles.title}>รับน้องขึ้นดอยสุเทพ</Text>

          <Pressable onPress={() => alert('แชร์กิจกรรม')} style={styles.shareBtn}>
            <Ionicons name="share-social" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* HERO */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroTitle}>Torch Hike 2025</Text>
          <Text style={styles.heroSubtitle}>รวมใจขึ้นดอย ต้อนรับชาวใหม่</Text>
          <Text style={styles.countdown}>⏳ {countdown}</Text>
        </View>

        {/* LIST */}
        <FlatList
          data={sampleEvents}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {/* MAP BUTTON */}
       <Pressable
  style={styles.mapBtn}
  onPress={() =>
    navigation.navigate("EventMap", {
      place: {
        name: "วัดพระธาตุดอยสุเทพ",
        latitude: 18.8049,
        longitude: 98.9215,
      }
    })
  }
>
  <Text style={styles.mapBtnText}>ดูเส้นทางไปดอยสุเทพ</Text>
</Pressable>


        {/* MODAL */}
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selected?.title}</Text>
                  <Pressable onPress={closeDetails}>
                    <Ionicons name="close" size={22} />
                  </Pressable>
                </View>

                <Text style={styles.modalTime}>{selected?.time}</Text>
                <Text style={styles.modalLocation}>{selected?.location}</Text>

                <Text style={styles.modalDetails}>{selected?.details}</Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalActionPrimary}
                    onPress={() => alert('จองที่นั่งเรียบร้อย')}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>
                      จองที่นั่ง
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalActionSecondary}
                    onPress={() => alert('แชร์กิจกรรม')}
                  >
                    <Text style={{ fontWeight: '700' }}>แชร์</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  gradient: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 18,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: { padding: 8 },
  shareBtn: { padding: 8 },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },

  // HERO
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 6,
  },
  countdown: {
    marginTop: 8,
    color: '#ffd966',
    fontWeight: '700',
    fontSize: 16,
  },

  // CARD
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardTime: { color: '#6b7280', fontSize: 12 },
  cardShort: { color: '#374151', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLocation: { marginLeft: 6, color: '#555' },
  rsvpButton: {
    backgroundColor: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  rsvpText: {
    color: '#fff',
    fontWeight: '700',
  },

  // MAP BUTTON
  mapBtn: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  mapBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  modalTime: {
    color: '#6b7280',
    marginBottom: 4,
  },
  modalLocation: {
    color: '#333',
    marginBottom: 12,
  },
  modalDetails: {
    fontSize: 15,
    lineHeight: 21,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalActionPrimary: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  modalActionSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
