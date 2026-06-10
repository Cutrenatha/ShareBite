import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Store, Users, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'', city:'', restaurantName:'', area:'' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await register({ ...form, role }); toast.success('Akun berhasil dibuat! 🎉'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.error || 'Registrasi gagal'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-xl">🍱</div>
          <span className="font-display font-black text-brand-primary text-2xl">ShareBite</span>
        </div>
        <div className="card">
          {step === 1 ? (
            <>
              <h2 className="font-display font-bold text-xl text-gray-800 mb-1">Daftar sebagai?</h2>
              <p className="text-gray-400 text-sm mb-6">Pilih peran Anda di platform ShareBite</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setRole('donor'); setStep(2); }}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:bg-brand-light transition-all text-center group">
                  <Store size={32} className="mx-auto mb-3 text-gray-400 group-hover:text-brand-primary transition-colors" />
                  <p className="font-semibold text-gray-700 group-hover:text-brand-primary">Pendonor</p>
                  <p className="text-xs text-gray-400 mt-1">Restoran, Kafe, Kantin</p>
                </button>
                <button onClick={() => { setRole('volunteer'); setStep(2); }}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:bg-brand-light transition-all text-center group">
                  <Users size={32} className="mx-auto mb-3 text-gray-400 group-hover:text-brand-primary transition-colors" />
                  <p className="font-semibold text-gray-700 group-hover:text-brand-primary">Relawan</p>
                  <p className="text-xs text-gray-400 mt-1">Volunteer distribusi</p>
                </button>
              </div>
              <p className="text-center text-sm text-gray-400 mt-6">Sudah punya akun? <Link to="/login" className="text-brand-primary font-semibold hover:underline">Masuk</Link></p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={18}/></button>
                <div>
                  <h2 className="font-display font-bold text-xl text-gray-800">Data {role === 'donor' ? 'Pendonor' : 'Relawan'}</h2>
                  <p className="text-gray-400 text-xs">{role === 'donor' ? '🏪 Restoran / Kafe / Kantin' : '🤝 Relawan Distribusi'}</p>
                </div>
              </div>
              <form onSubmit={handle} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                  <input className="input-field" placeholder="Ahmad Ridwan" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                {role === 'donor' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Restoran/Kafe *</label>
                    <input className="input-field" placeholder="Resto Padang Sejahtera" required value={form.restaurantName} onChange={e => setForm({...form, restaurantName: e.target.value})} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" className="input-field" placeholder="email@contoh.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                  <input type="password" className="input-field" placeholder="Min. 6 karakter" minLength={6} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No. Telepon</label>
                  <input className="input-field" placeholder="0812xxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                {role === 'donor' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat</label>
                      <input className="input-field" placeholder="Jl. Sudirman No. 10" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Kota</label>
                      <input className="input-field" placeholder="Banda Aceh" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Area Aktif</label>
                    <input className="input-field" placeholder="Banda Aceh Utara" value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                  {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <>Daftar Sekarang <ArrowRight size={16}/></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
