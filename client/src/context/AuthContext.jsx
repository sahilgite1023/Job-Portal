import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data.user))
        .catch(() => { setToken(null); localStorage.removeItem('token'); });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (e) {
      return false;
    } finally { setLoading(false); }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch { return false; } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null); setToken(null); localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
