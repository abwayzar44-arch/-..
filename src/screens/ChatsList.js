import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebase';

export default function ChatsList({ navigation }) {
  const [chats, setChats] = useState([]);
  const uid = auth().currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', uid)
      .orderBy('lastUpdated', 'desc')
      .onSnapshot(query => {
        const data = query.docs.map(d => ({ id: d.id, ...d.data() }));
        setChats(data);
      }, err => console.error(err));
    return unsubscribe;
  }, [uid]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { chatId: item.id, title: item.title || 'دردشة' })}>
      <Text style={styles.title}>{item.title || 'دردشة'}</Text>
      <Text style={styles.last}>{item.lastMessage || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد محادثات بعد</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  last: { color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
});
