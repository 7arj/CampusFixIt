import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Image } from 'react-native'; // Added Image import
import api, { BASE_URL } from '../services/api'; // Import BASE_URL
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
      {/* Show Image if it exists */}
      {item.imageUrl && (
        <Image 
          source={{ uri: `${BASE_URL}${item.imageUrl}` }} 
          style={styles.issueImage} 
        />
      )}
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.category}>Category: {item.category}</Text>
        <Text style={{ color: item.status === 'Resolved' ? 'green' : 'orange', fontWeight: 'bold' }}>
          Status: {item.status}
        </Text>
      </View>
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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  card: { backgroundColor: 'white', marginBottom: 15, borderRadius: 10, overflow: 'hidden', elevation: 3 },
  issueImage: { width: '100%', height: 200 }, // Style for the image
  textContainer: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { color: '#666', marginBottom: 10 },
  category: { fontStyle: 'italic', marginBottom: 5 }
});

export default HomeScreen;