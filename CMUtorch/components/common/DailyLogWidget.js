// DailyLogWidget.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// ตัวอย่าง data mock
const dailyLogs = [
  { id: '1', name: 'Alice', room: '101', time: '08:30' },
  { id: '2', name: 'Bob', room: '202', time: '09:15' },
  { id: '3', name: 'Charlie', room: '303', time: '10:05' },
];

const DailyLogWidget = () => {
  return (
    <View style={styles.widgetContainer}>
      <Text style={styles.title}>Daily Access Log</Text>
      <FlatList
        data={dailyLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.room}>{item.room}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    marginTop: 50,
    marginLeft: 20,
    width: '80%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  name: { fontWeight: '500' },
  room: { fontStyle: 'italic' },
  time: { color: '#555' },
});

export default DailyLogWidget;
