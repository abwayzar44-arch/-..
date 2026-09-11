import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { firestore, auth } from '../firebase';

export default function ChatScreen({ route }) {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(q => {
        const data = q.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(data);
      });
    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = {
      text: text.trim(),
      sender: uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    await firestore().collection('chats').doc(chatId).collection('messages').add(msg);
    await firestore().collection('chats').doc(chatId).set({ lastMessage: msg.text, lastUpdated: firestore.FieldValue.serverTimestamp() }, { merge: true });
    setText('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.bubble, item.sender === uid ? styles.mine : styles.theirs]}>
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList data={messages} keyExtractor={m => m.id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />
      <View style={styles.composer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="اكتب رسالة..." />
        <TouchableOpacity style={styles.send} onPress={sendMessage}><Text style={{ color: '#fff' }}>إرسال</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  mine: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  theirs: { backgroundColor: '#FFF', alignSelf: 'flex-start' },
  msgText: { fontSize: 16 },
  composer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 12, marginRight: 8 },
  send: { backgroundColor: '#25D366', paddingHorizontal: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
