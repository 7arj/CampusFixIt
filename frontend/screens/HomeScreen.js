import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import api, { BASE_URL } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this installed

const HomeScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext); // Get logout function

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues');
      // If Admin: res.data contains ALL issues
      // If Student: res.data contains ONLY their issues
      setIssues(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not fetch issues");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIssues();
    setRefreshing(false);
  };

  useEffect(() => {
    // Fetch issues when screen loads or gains focus
    const unsubscribe = navigation.addListener('focus', fetchIssues);
    
    // Add a Logout button to the top right header
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      ),
      headerTitle: user?.isAdmin ? "Admin Dashboard" : "My Issues",
    });

    return unsubscribe;
  }, [navigation, user]);

  // Admin Function: Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/issues/${id}/status`, { status: newStatus });
      Alert.alert("Success", `Issue marked as ${newStatus}`);
      fetchIssues(); // Refresh list to see changes
    } catch (e) {
      Alert.alert("Error", "Could not update status");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Display Image if available */}
      {item.imageUrl && (
        <Image 
          source={{ uri: `${BASE_URL}${item.imageUrl}` }} 
          style={styles.issueImage} 
        />
      )}
      
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'Resolved' ? '#e6fffa' : '#fffaf0', 
              color: item.status === 'Resolved' ? '#2c7a7b' : '#c05621' }
          ]}>
            {item.status}
          </Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>Category: {item.category}</Text>
        {/* Show who reported it (only relevant for Admins to see) */}
        {user.isAdmin && item.user && (
          <Text style={styles.meta}>Reported by: {item.user.name || item.user.email}</Text>
        )}

        {/* --- ADMIN CONTROLS --- */}
        {user.isAdmin && item.status !== 'Resolved' && (
          <View style={styles.adminControls}>
            <Text style={styles.adminLabel}>Update Status:</Text>
            <View style={styles.buttonRow}>
              {item.status === 'Open' && (
                <TouchableOpacity 
                  style={[styles.btn, styles.btnProgress]} 
                  onPress={() => updateStatus(item._id, 'In Progress')}
                >
                  <Text style={styles.btnText}>In Progress</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.btn, styles.btnResolve]} 
                onPress={() => updateStatus(item._id, 'Resolved')}
              >
                <Text style={styles.btnText}>Resolve</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={issues}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No issues found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f7fa' },
  card: { backgroundColor: 'white', marginBottom: 15, borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  issueImage: { width: '100%', height: 200, resizeMode: 'cover' },
  textContainer: { padding: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', flex: 1 },
  description: { color: '#4a5568', marginBottom: 10, fontSize: 14 },
  meta: { fontSize: 12, color: '#718096', fontStyle: 'italic', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  
  // Admin Styles
  adminControls: { marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  adminLabel: { fontSize: 12, fontWeight: 'bold', color: '#718096', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', flex: 1 },
  btnProgress: { backgroundColor: '#ecc94b' },
  btnResolve: { backgroundColor: '#48bb78' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#a0aec0' }
});

export default HomeScreen;