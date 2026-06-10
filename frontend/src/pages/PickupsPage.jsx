import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { MapPin, Clock, User, Phone, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const FLOW = {
  assigned: { next: 'on_the_way', label: '🚗 Mulai Perjalanan' },
  on_the_way: { next: 'picked_up', label: '✅ Konfirmasi Penjemputan' },
  picked_up: { next: 'distributed', label: '🎉 Selesai Distribusi', needsCount: true },
};

export default function PickupsPage() {
  const { user } = useAuth();
  const isDonor = user?.role === 'donor';
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(null);
  const [recipientCount, setRecipientCount] = useState('');
  const [notes, setNotes] = useState('');

  const load = () => {
    setLoading(true);
    api.get(`/delivery/pickups${filterStatus ? `?status=${filterStatus}` : ''}`)
      .then(r => setPickups(r.data.pickups))
      .catch(() => toast.error('Gagal memuat data'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterStatus]);

  const updateStatus = async (pickupId, status, count, notesVal) => {
    setUpdating(pickupId);
    try {
      await api.put(`/delivery/status/${pickupId}`, { status, recipientCount: count, notes: notesVal });
      toast.success('Status diperbarui ✅');
      setModal(null); setRecipientCount(''); setNotes('');
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Gagal update status'); }
    finally { setUpdating(null); }
  };

  const handleAction = (pickup) => {
    const flow = FLOW[pickup.status];
    if (!flow) return;
    if (flow.needsCount) { setModal(pickup); return; }
    updateStatus(pickup.pickup_id, flow.next, null, null);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">{isDonor ? 'Monitor Pickup' : 'Tugas Pickup Saya'}</h1>
          <p className="text-gray-400 text-sm">{pickups.length} pickup ditemukan</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field w-auto py-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="assigned">Ditugaskan</option>
            <option value="on_the_way">Dalam Perjalanan</option>
            <option value="picked_up">Sudah Dijemput</option>
            <option value="distributed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <button onClick={load} className="btn-ghost p-2.5"><RefreshCw size={16}/></button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_,i) => <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse"/>)}</div>
      ) : pickups.length === 0 ? (
        <div className="card text-center py-16">
          <span className="text-5xl">🚚</span>
          <h3 className="font-display font-bold text-lg text-gray-500 mt-4">Tidak ada pickup</h3>
          <p className="text-gray-400 text-sm">{isDonor ? 'Belum ada relawan yang mengambil donasi Anda' : 'Belum ada tugas pickup'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pickups.map(p => (
            <div key={p.pickup_id} className="card hover:shadow-warm-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🍱</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-display font-bold text-gray-800">{p.food_name}</h3>
                      <StatusBadge status={p.status}/>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-brand-primary"/><span className="truncate">{p.pickup_location}</span></div>
                      <div className="flex items-center gap-2"><Clock size={13} className="text-brand-primary"/><span>{format(new Date(p.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}</span></div>
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-brand-primary"/>
                        <span>{isDonor ? p.volunteer_name : p.restaurant_name}</span>
                      </div>
                      {(isDonor ? p.volunteer_phone : p.donor_phone) && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-brand-primary"/>
                          <a href={`tel:${isDonor ? p.volunteer_phone : p.donor_phone}`} className="text-brand-primary hover:underline">{isDonor ? p.volunteer_phone : p.donor_phone}</a>
                        </div>
                      )}
                    </div>
                    {p.notes && <p className="text-xs text-gray-400 mt-2 italic">Catatan: {p.notes}</p>}
                    {p.distributed_at && <p className="text-xs text-green-600 font-semibold mt-1">✅ Selesai: {format(new Date(p.distributed_at), 'dd MMM yyyy, HH:mm')}</p>}
                  </div>
                </div>
                {!isDonor && FLOW[p.status] && (
                  <div className="flex-shrink-0 flex flex-col gap-1">
                    <button onClick={() => handleAction(p)} disabled={updating === p.pickup_id} className="btn-primary text-sm py-2 flex items-center gap-2 whitespace-nowrap">
                      {updating === p.pickup_id ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : FLOW[p.status].label}
                    </button>
                    <button onClick={() => updateStatus(p.pickup_id, 'cancelled', null, null)} className="text-xs text-red-400 hover:text-red-500 text-center">Batalkan</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <h3 className="font-display font-bold text-xl mb-1">Konfirmasi Distribusi</h3>
            <p className="text-gray-400 text-sm mb-4">Donasi: <strong>{modal.food_name}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Penerima</label>
                <input type="number" min="0" className="input-field" placeholder="Berapa orang yang menerima?" value={recipientCount} onChange={e => setRecipientCount(e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan (opsional)</label>
                <textarea rows={2} className="input-field resize-none" placeholder="Kondisi distribusi, dll." value={notes} onChange={e => setNotes(e.target.value)}/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={() => updateStatus(modal.pickup_id, 'distributed', recipientCount, notes)} disabled={updating === modal.pickup_id} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {updating === modal.pickup_id ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : '🎉 Selesai!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
