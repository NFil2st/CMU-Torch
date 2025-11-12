import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    // ตัวอย่าง login ง่าย ๆ
    if (username && password) {
      await AsyncStorage.setItem('userToken', '12345'); // save token
      navigation.replace('Tracker'); // ไปหน้า Tracker
    } else {
      alert('กรุณากรอก username และ password');
    }
  };

  return (
    <View style={styles.container}>
           {/* welcome to ด้านบน เล็กกว่า */}
           <Text style={styles.welcomeText}>welcome to</Text>
     
           {/* CMU + torch ต่อกัน */}
           <View style={styles.row}>
             <Text style={styles.cmuText}>CMU</Text>
             <Text style={styles.torchText}>torch</Text>
           </View>

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff', paddingHorizontal:20 },
  title: { fontSize:30, fontWeight:'700', color:'#fff', marginBottom:30 },
  input: { width:'100%', backgroundColor:'#fff', padding:10, borderRadius:10, marginBottom:15, borderWidth:1, borderColor:'#4AD1A9' },
  button: { backgroundColor:'#4AD1A9', padding:15, borderRadius:15, width:'100%', alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'700', fontSize:16 },
  welcomeText: {
    fontSize: 20,       // เล็กกว่า CMU/torch
    color: '#A66DBB',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',   // ต่อกันในแถวเดียว
    alignItems: 'center',
    paddingBottom: 30,
  },
  cmuText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#A66DBB',
  },
  torchText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#EFA04C',
  },
});
