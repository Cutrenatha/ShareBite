import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Gift, Truck, Users, TrendingUp, Plus, ArrowRight, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-64"/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}</div>
    </div>
  );

  const isDonor = user?.role === 'donor';
  const stats = data?.stats || {};
  const monthly = (data?.monthly || []).map(m => ({
    bulan: m.month ? m.month.substring(5,7) + '/' + m.month.substring(2,4) : '-',
    jumlah: parseInt(m.count)
  })).reverse();
  const recent = data?.recent || [];

  const statCards = isDonor ? [
    { icon: Gift, label: 'Total Donasi', value: stats.total_donations||0, color: 'bg-orange-100 text-orange-600', desc: 'semua waktu' },
    { icon: TrendingUp, label: 'Aktif', value: stats.active_donations||0, color: 'bg-green-100 text-green-600', desc: 'tersedia sekarang' },
    { icon: Truck, label: 'Terdistribusi', value: stats.completed_donations||0, color: 'bg-blue-100 text-blue-600', desc: 'selesai' },
    { icon: Users, label: 'Penerima', value: stats.total_recipients||0, color: 'bg-purple-100 text-purple-600', desc: 'total orang terbantu' },
  ] : [
    { icon: Truck, label: 'Total Pickup', value: stats.total_pickups||0, color: 'bg-orange-100 text-orange-600', desc: 'semua waktu' },
    { icon: TrendingUp, label: 'Selesai', value: stats.completed_pickups||0, color: 'bg-green-100 text-green-600', desc: 'berhasil' },
    { icon: Clock, label: 'Aktif', value: stats.active_pickups||0, color: 'bg-blue-100 text-blue-600', desc: 'sedang berjalan' },
    { icon: Users, label: 'Penerima', value: stats.total_recipients_helped||0, color: 'bg-purple-100 text-purple-600', desc: 'orang dibantu' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">Selamat datang, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{isDonor ? 'Kelola donasi makanan Anda hari ini' : 'Lihat tugas pickup yang tersedia'}</p>
        </div>
        {isDonor && <Link to="/donations/new" className="btn-primary flex items-center gap-2 self-start"><Plus size={16}/> Buat Donasi</Link>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, desc }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={20}/></div>
            <div>
              <p className="text-2xl font-display font-black text-gray-800">{value}</p>
              <p className="font-semibold text-sm text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-display font-bold text-lg text-gray-800 mb-4">{isDonor ? 'Aktivitas Donasi' : 'Aktivitas Pickup'} (6 Bulan)</h3>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }}/>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="jumlah" fill="#E8621A" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 flex-col gap-2">
              <span className="text-4xl">📊</span><p className="text-sm">Belum ada data</p>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-gray-800">Aktivitas Terbaru</h3>
            <Link to={isDonor ? '/donations' : '/pickups'} className="text-brand-primary text-sm font-semibold flex items-center gap-1">Lihat semua <ArrowRight size={14}/></Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-gray-300"><span className="text-4xl block mb-2">🍱</span><p className="text-sm">Belum ada aktivitas</p></div>
          ) : (
            <div className="space-y-3">
              {recent.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🍱</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.food_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.pickup_location || item.restaurant_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={item.status}/>
                    <p className="text-[10px] text-gray-300">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
