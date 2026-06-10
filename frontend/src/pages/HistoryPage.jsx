import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { User, Users, FileText, MapPin } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const isDonor = user?.role === 'donor';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/history').then(r => setHistory(r.data.history)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-800">Riwayat Distribusi</h1>
        <p className="text-gray-400 text-sm mt-1">{history.length} riwayat ditemukan</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"/>)}</div>
      ) : history.length === 0 ? (
        <div className="card text-center py-16">
          <span className="text-5xl">📋</span>
          <h3 className="font-display font-bold text-lg text-gray-500 mt-4">Belum ada riwayat</h3>
          <p className="text-gray-400 text-sm">Riwayat distribusi akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(h => (
            <div key={h.report_id} className="card hover:shadow-warm transition-all flex gap-4 items-start">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">✅</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-gray-800">{h.food_name}</h3>
                  <span className="badge bg-green-100 text-green-700">Terdistribusi</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-2"><User size={13} className="text-green-500"/><span>{isDonor ? h.volunteer_name : h.donor_name}</span></div>
                  <div className="flex items-center gap-2"><Users size={13} className="text-green-500"/><span>{h.recipient_count} penerima</span></div>
                  <div className="flex items-center gap-2"><FileText size={13} className="text-green-500"/><span>{format(new Date(h.distributed_at), 'dd MMM yyyy, HH:mm', { locale: id })}</span></div>
                  {h.donor_address && <div className="flex items-center gap-2"><MapPin size={13} className="text-green-500"/><span className="truncate">{h.donor_address}</span></div>}
                </div>
                {h.notes && <p className="text-xs text-gray-400 mt-1.5 italic">"{h.notes}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
