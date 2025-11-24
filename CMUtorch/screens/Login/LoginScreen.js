import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
  if (!username || !password) {
    alert('กรุณากรอก username และ password');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // สมมติ backend ส่ง token กลับมา
      await AsyncStorage.setItem('userToken', data.token);
      const expireTime = Date.now() + 3 * 60 * 1000;
      await AsyncStorage.setItem('tokenExpire', expireTime.toString());
      navigation.replace('Tracker');
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
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
      <TouchableOpacity
  style={[styles.button, { backgroundColor: '#FFA500', marginTop: 10 }]}
  onPress={() => navigation.navigate('Signup')}
>
  <Text style={styles.buttonText}>สมัครบัญชี</Text>
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
