import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REPLACE THIS with the IPv4 address you found in CMD
const API_URL = 'http://10.51.3.80:5000/api';
const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request if it exists
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;