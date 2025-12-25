import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://10.44.71.14:5000';

const API_URL = `${BASE_URL}/api`;

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