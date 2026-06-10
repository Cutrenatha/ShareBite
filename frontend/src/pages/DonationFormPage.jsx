import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Image } from 'lucide-react';
import { format, addHours } from 'date-fns';

export default function DonationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    food_name: '', quantity: '', unit: 'porsi', pickup_location: '', description: '',
    expired_at: format(addHours(new Date(), 4), "yyyy-MM-dd'T'HH:mm"),
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/donations/${id}`).then(r => {
        const d = r.data;
        setForm({ food_name: d.food_name, quantity: d.quantity, unit: d.unit||'porsi', pickup_location: d.pickup_location, description: d.description||'', expired_at: format(new Date(d.expired_at), "yyyy-MM-dd'T'HH:mm") });
      }).catch(() => toast.error('Gagal memuat data'));
    }
  }, [id]);

  const handleImg = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/donations/${id}`, form);
        toast.success('Donasi diperbarui! ✅');
      } else {
        const formData = new FormData();
        Object.entries(form).forEach(([k,v]) => formData.append(k, v));
        if (file) formData.append('food_image', file);
        await api.post('/donations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Donasi berhasil dibuat! 🍱');
      }
      navigate('/donations');
    } catch (err) { toast.error(err.response?.data?.error || 'Gagal menyimpan'); }
    finally { setLoading(false); }
  };

  const units = ['porsi','box','bungkus','kilogram','loaf','buah'];

  return (
    <div className="max-w-xl mx-auto animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2"><ArrowLeft size={18}/></button>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">{isEdit ? 'Edit Donasi' : 'Buat Donasi Baru'}</h1>
          <p className="text-gray-400 text-sm">Isi informasi makanan yang akan didonasikan</p>
        </div>
      </div>

      <form onSubmit={handle} className="card space-y-5">
        {!isEdit && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Makanan</label>
            <label className="cursor-pointer block">
              {imgPreview ? (
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img src={imgPreview} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-semibold">Ganti Foto</p>
                  </div>
                </div>
              ) : (
                <div className="h-40 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><Image size={22} className="text-orange-400"/></div>
                  <p className="text-sm text-gray-400 font-medium">Klik untuk upload foto</p>
                  <p className="text-xs text-gray-300">JPG, PNG (maks. 5MB)</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImg}/>
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Makanan *</label>
          <input required className="input-field" placeholder="Nasi Padang, Roti Bakar, ..." value={form.food_name} onChange={e => setForm({...form, food_name: e.target.value})}/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah *</label>
            <input required type="number" min="1" className="input-field" placeholder="20" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Satuan</label>
            <select className="input-field" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi Penjemputan *</label>
          <input required className="input-field" placeholder="Jl. Sudirman No. 10, Banda Aceh" value={form.pickup_location} onChange={e => setForm({...form, pickup_location: e.target.value})}/>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Batas Waktu Konsumsi *</label>
          <input required type="datetime-local" className="input-field" value={form.expired_at} onChange={e => setForm({...form, expired_at: e.target.value})}/>
          <p className="text-xs text-gray-400 mt-1">Pastikan waktu ini realistis agar relawan bisa menjemput</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea rows={3} className="input-field resize-none" placeholder="Informasi tambahan tentang makanan..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Batal</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : (isEdit ? '💾 Simpan' : '🍱 Buat Donasi')}
          </button>
        </div>
      </form>
    </div>
  );
}
