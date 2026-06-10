import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Plus, MapPin, Clock, Users, Pencil, Trash2, ChevronRight, Search } from 'lucide-react';
import { format, isPast } from 'date-fns';

export default function DonationsPage() {
  const { user } = useAuth();
  const isDonor = user?.role === 'donor';
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [accepting, setAccepting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(`/donations${filter ? `?status=${filter}` : ''}`)
      .then(r => setDonations(r.data.donations))
      .catch(() => toast.error('Gagal memuat donasi'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus donasi ini?')) return;
    try { await api.delete(`/donations/${id}`); toast.success('Donasi dihapus'); load(); }
    catch { toast.error('Gagal menghapus'); }
  };

  const handleAccept = async (donationId) => {
    setAccepting(donationId);
    try { await api.post(`/delivery/accept/${donationId}`); toast.success('Pickup diterima! 🎉'); load(); }
    catch (err) { toast.error(err.response?.data?.error || 'Gagal menerima pickup'); }
    finally { setAccepting(null); }
  };

  const filtered = donations.filter(d =>
    d.food_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.pickup_location?.toLowerCase().includes(search.toLowerCase()) ||
    d.restaurant_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">{isDonor ? 'Donasi Saya' : 'Donasi Tersedia'}</h1>
          <p className="text-gray-400 text-sm">{filtered.length} donasi ditemukan</p>
        </div>
        {isDonor && <Link to="/donations/new" className="btn-primary flex items-center gap-2 self-start"><Plus size={16}/> Buat Donasi Baru</Link>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input className="input-field pl-9 py-2.5" placeholder="Cari donasi..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        {isDonor && (
          <select className="input-field w-auto py-2.5" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="claimed">Diklaim</option>
            <option value="picked_up">Dijemput</option>
            <option value="distributed">Terdistribusi</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="font-display font-bold text-lg text-gray-600">Tidak ada donasi</h3>
          <p className="text-gray-400 text-sm mt-1">{isDonor ? 'Mulai buat donasi makanan Anda' : 'Belum ada donasi tersedia saat ini'}</p>
          {isDonor && <Link to="/donations/new" className="btn-primary mt-4 inline-flex items-center gap-2"><Plus size={16}/>Buat Donasi</Link>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(d => (
            <div key={d.donation_id} className="card hover:shadow-warm-lg transition-all duration-200 flex flex-col">
              <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl mb-4 flex items-center justify-center text-5xl overflow-hidden">
                {d.food_image ? <img src={`http://localhost:5002${d.food_image}`} className="w-full h-full object-cover rounded-xl" alt={d.food_name}/> : '🍱'}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-gray-800 leading-tight">{d.food_name}</h3>
                  <StatusBadge status={d.status}/>
                </div>
                {d.restaurant_name && <p className="text-xs text-brand-primary font-semibold mb-2">🏪 {d.restaurant_name}</p>}
                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Users size={13}/><span>{d.quantity} {d.unit||'porsi'}</span></div>
                  <div className="flex items-center gap-2"><MapPin size={13}/><span className="truncate">{d.pickup_location}</span></div>
                  <div className="flex items-center gap-2">
                    <Clock size={13}/>
                    <span className={isPast(new Date(d.expired_at)) ? 'text-red-500' : ''}>
                      Exp: {format(new Date(d.expired_at), 'dd MMM, HH:mm')}
                    </span>
                  </div>
                </div>
                {d.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{d.description}</p>}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2 flex-wrap">
                {isDonor ? (
                  <>
                    {d.status === 'available' && (
                      <Link to={`/donations/edit/${d.donation_id}`} className="btn-ghost flex items-center gap-1 text-sm py-1.5"><Pencil size={13}/> Edit</Link>
                    )}
                    {d.status === 'available' && (
                      <button onClick={() => handleDelete(d.donation_id)} className="btn-ghost text-red-400 hover:bg-red-50 hover:text-red-500 flex items-center gap-1 text-sm py-1.5"><Trash2 size={13}/> Hapus</button>
                    )}
                  </>
                ) : (
                  d.status === 'available' && !isPast(new Date(d.expired_at)) && (
                    <button onClick={() => handleAccept(d.donation_id)} disabled={accepting === d.donation_id}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                      {accepting === d.donation_id ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <>Ambil Tugas <ChevronRight size={14}/></>}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
