import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const handleSendCode = () => {
    if (!phoneNumber) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف أولاً');
      return;
    }
    Alert.alert('نجاح', `تم إرسال كود التحقيق إلى ${phoneNumber}`);
    setConfirm(true);
  };

  const handleVerifyCode = () => {
    if (!code) {
      Alert.alert('تنبيه', 'يرجى إدخال كود التحقيق');
      return;
    }
    Alert.alert('مرحباً بك!', 'تم تسجيل الدخول بنجاح في واتساب وهيب');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>واتساب وهيب</Text>
      
      {!confirm ? (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>أدخل رقم الهاتف للبدء:</Text>
          <TextInput
            style={styles.input}
            placeholder="+967 xxx xxx xxx"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>إرسال كود التحقق</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>تأكيد الدخول</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
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
