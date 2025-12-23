import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues');
      setIssues(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchIssues);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.category}</Text>
      <Text style={{ color: item.status === 'Resolved' ? 'green' : 'orange' }}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.name}</Text>
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  card: { padding: 15, backgroundColor: 'white', marginBottom: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' }
});

export default HomeScreen;