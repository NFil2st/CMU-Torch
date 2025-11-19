// StackHistoryScreen.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import StackColorPopup from "../../components/common/StackColorPopup";

export default function StackHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);

  // ตัวอย่างการเพิ่ม popup ใหม่
  const addStack = (stackValue) => {
    setHistory(prev => [...prev, stackValue]);
    setCurrentPopup(stackValue);
  };

  const closePopup = () => {
    setCurrentPopup(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History of Stack Popups</Text>

      <Pressable style={styles.button} onPress={() => addStack(60)}>
        <Text style={styles.buttonText}>Show New Stack Popup</Text>
      </Pressable>

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Stack: {item}</Text>
          </View>
        )}
        style={styles.historyList}
      />

      {currentPopup !== null && (
        <StackColorPopup
          stack={currentPopup}
          visible={true}
          onClose={closePopup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF8C6B",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyText: {
    fontSize: 18,
  },
});
