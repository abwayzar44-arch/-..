import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import ChatsList from './src/screens/ChatsList';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

function AuthScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف أولاً');
      return;
    }
    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('نجاح', `تم إرسال كود التحقق إلى ${phoneNumber}`);
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', error.message || 'فشل إرسال كود التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('تنبيه', 'يرجى إدخال كود التحقيق');
      return;
    }
    try {
      setLoading(true);
      await confirm.confirm(code);
      Alert.alert('مرحباً بك!', 'تم تسجيل الدخول بنجاح');
      // onAuthStateChanged will navigate to Chats
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', 'كود التحقق غير صحيح أو انتهت صلاحيته');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>واتساب وهيب</Text>
      {!confirm ? (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>أدخل رقم الهاتف للبدء:</Text>
          <TextInput
            style={styles.input}
            placeholder="+967(مثال) 771234567"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>إرسال كود التحقق</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>أدخل كود التحقق المرسل لك:</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>تأكيد الدخول</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#25D366" /></SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Chats" component={ChatsList} options={{ title: 'المحادثات' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'دردشة' }} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
