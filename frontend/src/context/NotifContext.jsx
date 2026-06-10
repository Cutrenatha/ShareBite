import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
const NotifContext = createContext(null);
export const NotifProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then(r => { setNotifications(r.data.notifications); setUnreadCount(r.data.unread_count); }).catch(() => {});
    socketRef.current = io('http://localhost:5004', { transports: ['websocket'] });
    socketRef.current.emit('register', user.userId);
    socketRef.current.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.custom((t) => (
        <div className={`bg-white rounded-xl shadow-warm-lg p-4 max-w-sm border-l-4 border-brand-primary flex gap-3 items-start ${t.visible ? 'animate-slide-up' : ''}`}>
          <div className="text-2xl">🍱</div>
          <div><p className="font-semibold text-sm text-gray-800">ShareBite</p><p className="text-xs text-gray-500 mt-0.5">{notif.message}</p></div>
        </div>
      ), { duration: 4000 });
    });
    return () => { socketRef.current?.disconnect(); };
  }, [user]);
  const markRead = async (id) => { await api.put(`/notifications/read/${id}`); setNotifications(prev => prev.map(n => n.notif_id === id ? { ...n, is_read: 1 } : n)); setUnreadCount(prev => Math.max(0, prev - 1)); };
  const markAllRead = async () => { await api.put('/notifications/read-all'); setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 }))); setUnreadCount(0); };
  return <NotifContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>{children}</NotifContext.Provider>;
};
export const useNotif = () => useContext(NotifContext);
