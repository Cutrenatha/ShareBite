import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Building, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const isDonor = user?.role === 'donor';
  const p = user?.profile || {};
  const [form, setForm] = useState({
    name: user?.name||'', phone: p.phone||'', address: p.address||'',
    city: p.city||'', restaurantName: p.restaurant_name||'', area: p.area||'',
  });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.put('/auth/profile', form); updateUser({ name: form.name }); toast.success('Profil diperbarui! ✅'); }
    catch { toast.error('Gagal memperbarui profil'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
      <h1 className="font-display font-bold text-2xl text-gray-800">Profil Saya</h1>

      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-warm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gray-800">{user?.name}</h2>
          <p className="text-brand-primary text-sm font-semibold">{isDonor ? '🏪 Pendonor' : '🤝 Relawan'}</p>
          <p className="text-gray-400 text-xs mt-0.5">{user?.email}</p>
        </div>
        {!isDonor && p.volunteer_code && (
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">Kode Volunteer</p>
            <p className="font-mono font-bold text-brand-primary">{p.volunteer_code}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isDonor ? (
          <>
            <div className="card text-center py-4"><p className="text-lg font-black text-brand-primary truncate">{p.restaurant_name||'—'}</p><p className="text-xs text-gray-400 mt-1">Nama Restoran</p></div>
            <div className="card text-center py-4"><p className="text-2xl font-black text-brand-primary">{p.city||'—'}</p><p className="text-xs text-gray-400 mt-1">Kota</p></div>
          </>
        ) : (
          <>
            <div className="card text-center py-4"><p className="text-2xl font-black text-brand-primary">{p.total_deliveries||0}</p><p className="text-xs text-gray-400 mt-1">Total Pengiriman</p></div>
            <div className="card text-center py-4"><p className="text-sm font-bold text-brand-primary">{p.area||'—'}</p><p className="text-xs text-gray-400 mt-1">Area Aktif</p></div>
          </>
        )}
      </div>

      <form onSubmit={handle} className="card space-y-4">
        <h3 className="font-display font-bold text-lg text-gray-800">Edit Informasi</h3>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5"><User size={14} className="inline mr-1"/>Nama Lengkap</label>
          <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5"><Phone size={14} className="inline mr-1"/>No. Telepon</label>
          <input className="input-field" placeholder="0812xxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
        </div>
        {isDonor ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5"><Building size={14} className="inline mr-1"/>Nama Restoran/Kafe</label>
              <input className="input-field" value={form.restaurantName} onChange={e => setForm({...form, restaurantName: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5"><MapPin size={14} className="inline mr-1"/>Alamat</label>
              <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kota</label>
              <input className="input-field" value={form.city} onChange={e => setForm({...form, city: e.target.value})}/>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5"><MapPin size={14} className="inline mr-1"/>Area Aktif</label>
            <input className="input-field" value={form.area} onChange={e => setForm({...form, area: e.target.value})}/>
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <><Save size={16}/> Simpan Perubahan</>}
        </button>
      </form>

      <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-colors">
        <LogOut size={16}/> Keluar dari Akun
      </button>
    </div>
  );
}
