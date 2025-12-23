import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
      await AsyncStorage.setItem('token', res.data.token);
    } catch (e) {
      throw e;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data);
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
      await AsyncStorage.setItem('token', res.data.token);
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};