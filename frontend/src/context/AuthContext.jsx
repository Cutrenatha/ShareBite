import React, { createContext, useContext, useEffect, useState } from "react";
import api from '../utils/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('sb_token');
    const saved = localStorage.getItem('sb_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      api.get('/auth/me').then(r => { setUser(r.data); localStorage.setItem('sb_user', JSON.stringify(r.data)); }).catch(() => logout()).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('sb_token', res.data.token);
    localStorage.setItem('sb_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('sb_token', res.data.token);
    localStorage.setItem('sb_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };
  const logout = () => { localStorage.removeItem('sb_token'); localStorage.removeItem('sb_user'); setUser(null); };
  const updateUser = (d) => { const u = { ...user, ...d }; setUser(u); localStorage.setItem('sb_user', JSON.stringify(u)); };
  return <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
