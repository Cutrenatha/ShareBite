import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await login(form.email, form.password); toast.success('Selamat datang! 👋'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.error || 'Login gagal'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex flex-1 bg-brand-primary relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 opacity-10">
          {['🍱','🥘','🍜','🥗','🍲','🍛'].map((e, i) => (
            <div key={i} className="absolute text-6xl" style={{ top:`${10+i*14}%`, left:`${5+(i%3)*35}%`, transform:`rotate(${i*15-30}deg)` }}>{e}</div>
          ))}
        </div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🍱</div>
            <div><h1 className="font-display font-black text-4xl">ShareBite</h1><p className="text-orange-200">Food Rescue Platform</p></div>
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Bersama kita kurangi<br /><span className="text-orange-200">food waste</span> Indonesia</h2>
          <p className="text-orange-100 text-lg max-w-md">Hubungkan restoran dan relawan dalam satu platform digital. Donasi makanan lebih cepat, terorganisir, dan transparan.</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['🏪','Pendonor','Restoran & Kafe'],['🤝','Relawan','Distribusi makanan'],['🍽️','Masyarakat','Penerima manfaat']].map(([icon,title,sub]) => (
              <div key={title} className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-orange-200 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-xl">🍱</div>
            <span className="font-display font-black text-brand-primary text-2xl">ShareBite</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-800 mb-1">Masuk ke akun</h2>
          <p className="text-gray-400 text-sm mb-8">Belum punya akun? <Link to="/register" className="text-brand-primary font-semibold hover:underline">Daftar sekarang</Link></p>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required className="input-field" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} required className="input-field pr-12" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <>Masuk <ArrowRight size={16}/></>}
            </button>
          </form>
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-gray-500 mb-2">Akun Demo (setelah init-db):</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>🏪 <span className="font-mono bg-white px-1 rounded">padang@example.com</span> / <span className="font-mono bg-white px-1 rounded">password123</span></p>
              <p>🤝 <span className="font-mono bg-white px-1 rounded">ahmad@example.com</span> / <span className="font-mono bg-white px-1 rounded">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
