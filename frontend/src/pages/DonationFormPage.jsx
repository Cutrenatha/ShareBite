import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Image,
  Utensils,
  Package,
  MapPin,
  Clock,
  FileText,
  Upload,
  ChevronDown,
  Check,
} from "lucide-react";
import { format, addHours } from "date-fns";

export default function DonationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [unitOpen, setUnitOpen] = useState(false);

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  const [form, setForm] = useState({
    food_name: "",
    quantity: "",
    unit: "porsi",
    pickup_location: "",
    description: "",
    expired_at: format(addHours(new Date(), 4), "yyyy-MM-dd'T'HH:mm"),
  });

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/donations/${id}`)
        .then((r) => {
          const d = r.data;
          setForm({
            food_name: d.food_name,
            quantity: d.quantity,
            unit: d.unit || "porsi",
            pickup_location: d.pickup_location,
            description: d.description || "",
            expired_at: format(new Date(d.expired_at), "yyyy-MM-dd'T'HH:mm"),
          });
        })
        .catch(() => toast.error("Gagal memuat data"));
    }
  }, [id, isEdit]);

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const payload = {
          food_name: form.food_name,
          quantity: Number(form.quantity),
          unit: form.unit,
          pickup_location: form.pickup_location,
          description: form.description,
          expired_at: new Date(form.expired_at).toISOString(),
        };

        console.log("UPDATE PAYLOAD:", payload);

        await api.put(`/donations/${id}`, payload);

        toast.success("Donasi diperbarui! ✅");
      } else {
        const formData = new FormData();

        Object.entries(form).forEach(([k, v]) => {
          formData.append(k, v);
        });

        if (file) {
          formData.append("food_image", file);
        }

        await api.post("/donations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Donasi berhasil dibuat!");
      }

      navigate("/donations");
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("ERROR RESPONSE:", err.response?.data);

      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Gagal menyimpan"
      );
    } finally {
      setLoading(false);
    }
  };

  const units = ["porsi", "box", "bungkus", "kilogram", "loaf", "buah"];

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const labelClass =
    "block text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-[0.16em]";

  const inputClass =
    "w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30";

  const textareaClass =
    "w-full min-h-[112px] rounded-2xl border border-orange-200 bg-white px-4 py-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30 resize-none";

  return (
    <div className="max-w-6xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white/80 border border-orange-100 p-5 mb-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-orange-100/70" />
        <div className="absolute right-16 bottom-[-70px] w-36 h-36 rounded-full bg-orange-200/35" />

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-all"
            style={{ color: primary }}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              {isEdit ? "Perbarui" : "Baru"}
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              {isEdit ? "Edit Donasi" : "Buat Donasi"}
            </h1>

            <p className="text-sm text-[#7A5C46] mt-1">
              Lengkapi informasi makanan agar relawan bisa menjemput dengan
              mudah.
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <form
        onSubmit={handle}
        className="rounded-[2rem] bg-white/95 border border-orange-100 p-5 md:p-6 shadow-[0_16px_45px_rgba(229,138,67,0.08)]"
      >
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-stretch">
          {/* Upload Area */}
          <div className="flex flex-col">
            <label className={labelClass}>Foto Makanan</label>

            {!isEdit ? (
              <label className="cursor-pointer flex-1 block">
                {imgPreview ? (
                  <div className="relative h-full min-h-[440px] rounded-[1.7rem] overflow-hidden border border-orange-100 group shadow-sm">
                    <img
                      src={imgPreview}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />

                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white font-bold text-sm shadow-lg"
                        style={{ color: primary }}
                      >
                        <Upload size={17} />
                        Ganti Foto
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[440px] rounded-[1.7rem] border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/70 to-white flex flex-col items-center justify-center gap-3 hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-orange-100 flex items-center justify-center shadow-sm">
                      <Image size={30} style={{ color: primary }} />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-[#2F3A56] font-extrabold">
                        Klik untuk upload foto
                      </p>

                      <p className="text-xs text-[#7A5C46] mt-1">
                        JPG, PNG, maksimal 5MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImg}
                />
              </label>
            ) : (
              <div className="h-full min-h-[440px] rounded-[1.7rem] bg-gradient-to-br from-orange-50/70 to-white border border-orange-100 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-white border border-orange-100 flex items-center justify-center shadow-sm mb-3">
                  <Image size={30} style={{ color: primary }} />
                </div>

                <p className="font-extrabold text-[#2F3A56]">Mode Edit</p>

                <p className="text-xs text-[#7A5C46] mt-1 max-w-[220px]">
                  Perbarui informasi donasi yang sudah dibuat.
                </p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="flex flex-col">
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Nama Makanan *</label>

                <div className="relative">
                  <Utensils
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Nasi Padang, Roti Bakar, ..."
                    value={form.food_name}
                    onChange={(e) => updateForm("food_name", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Jumlah *</label>

                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
                      type="number"
                      min="1"
                      className={inputClass}
                      placeholder="20"
                      value={form.quantity}
                      onChange={(e) => updateForm("quantity", e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className={labelClass}>Satuan</label>

                  <button
                    type="button"
                    onClick={() => setUnitOpen(!unitOpen)}
                    className="w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 flex items-center justify-between"
                  >
                    <span>{form.unit}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${
                        unitOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {unitOpen && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_18px_40px_rgba(229,138,67,0.16)]">
                      {units.map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            updateForm("unit", u);
                            setUnitOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all ${
                            form.unit === u
                              ? "bg-[#FFF4EC]"
                              : "text-[#2F3A56] hover:bg-[#FFF4EC]"
                          }`}
                          style={{
                            color: form.unit === u ? primary : undefined,
                          }}
                        >
                          <span>{u}</span>
                          {form.unit === u && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Lokasi Penjemputan *</label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    className={inputClass}
                    placeholder="Jl. Sudirman No. 10, Banda Aceh"
                    value={form.pickup_location}
                    onChange={(e) =>
                      updateForm("pickup_location", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Batas Waktu Konsumsi *</label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="datetime-local"
                    className={inputClass}
                    value={form.expired_at}
                    onChange={(e) => updateForm("expired_at", e.target.value)}
                  />
                </div>

                <p className="text-xs text-[#7A5C46] mt-1.5">
                  Pastikan waktu ini realistis agar relawan bisa menjemput.
                </p>
              </div>

              <div>
                <label className={labelClass}>Deskripsi</label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    rows={4}
                    className={textareaClass}
                    placeholder="Informasi tambahan tentang makanan..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-12 rounded-2xl border border-orange-200 bg-white text-[#7A5C46] font-bold hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7A5C46")}
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-12 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: primary,
                  boxShadow: "0 16px 30px rgba(229,138,67,0.25)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = primary)
                }
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : isEdit ? (
                  "Simpan"
                ) : (
                  "Buat Donasi"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}