import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Store,
  Users,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  MapPin,
  User,
  Building2,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    restaurantName: "",
    area: "",
  });
  const [loading, setLoading] = useState(false);

  const primary = "#E97D32";
  const primaryHover = "#D96E23";

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({ ...form, role });
      toast.success("Akun berhasil dibuat! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const inputClass =
    "w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-orange-300 hover:shadow-sm focus:border-[#E97D32] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30";

  const labelClass =
    "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-[0.13em]";

  const inputItems = [
    {
      label: "Nama Lengkap",
      field: "name",
      placeholder: "Ahmad Ridwan",
      required: true,
      icon: User,
    },
    ...(role === "donor"
      ? [
          {
            label: "Nama Restoran/Kafe",
            field: "restaurantName",
            placeholder: "Resto Padang Sejahtera",
            required: true,
            icon: Building2,
          },
        ]
      : []),
    {
      label: "Email",
      field: "email",
      placeholder: "email@contoh.com",
      required: true,
      type: "email",
      icon: Mail,
    },
    {
      label: "Password",
      field: "password",
      placeholder: "Min. 6 karakter",
      required: true,
      type: "password",
      min: 6,
      icon: Lock,
    },
    {
      label: "No. Telepon",
      field: "phone",
      placeholder: "0812xxxxxxxx",
      icon: Phone,
    },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at 18% 16%, rgba(255, 165, 92, 0.35) 0%, transparent 28%), radial-gradient(circle at 88% 12%, rgba(255, 111, 32, 0.24) 0%, transparent 26%), radial-gradient(circle at 90% 90%, rgba(255, 190, 120, 0.35) 0%, transparent 30%), linear-gradient(135deg, #FFF7F1 0%, #FFF0E6 45%, #FFE3CE 100%)",
        fontFamily: '"Segoe UI", "Roboto", sans-serif',
      }}
    >
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border border-orange-200 hover:border-orange-400 transition-all shadow-sm hover:shadow-lg"
      >
        <ArrowLeft
          size={18}
          className="transition-transform group-hover:-translate-x-1"
          style={{ color: primary }}
        />
        <span className="font-bold" style={{ color: primary }}>
          Kembali ke Beranda
        </span>
      </Link>

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-300/35 rounded-full blur-3xl" />
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-[980px] grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
        <div className="hidden lg:block">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 border border-orange-200 shadow-sm text-sm font-bold mb-6"
            style={{ color: primary }}
          >
            <Sparkles size={16} />
            Food sharing made easier
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-[-0.04em] text-[#2F3A56]">
            Mulai berbagi makanan dengan{" "}
            <span style={{ color: primary }}>cara yang lebih mudah.</span>
          </h1>

          <p className="mt-4 text-[#7A5C46] leading-relaxed max-w-md">
            Daftar sebagai pendonor atau relawan untuk membantu distribusi
            makanan berlebih kepada yang membutuhkan.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-3xl bg-white/85 border border-orange-200 p-5 shadow-[0_12px_35px_rgba(234,88,12,0.09)]">
              <Store className="mb-3" size={28} style={{ color: primary }} />
              <p className="font-bold text-[#2F3A56]">Pendonor</p>
              <p className="text-sm text-[#7A5C46] mt-1">
                Restoran, kafe, dan kantin.
              </p>
            </div>

            <div className="rounded-3xl bg-white/85 border border-orange-200 p-5 shadow-[0_12px_35px_rgba(234,88,12,0.09)]">
              <Users className="mb-3" size={28} style={{ color: primary }} />
              <p className="font-bold text-[#2F3A56]">Relawan</p>
              <p className="text-sm text-[#7A5C46] mt-1">
                Bantu proses distribusi.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-7 justify-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_12px_25px_rgba(233,125,50,0.25)]"
              style={{ background: primary }}
            >
              <Store size={23} className="text-white" />
            </div>

            <span
              className="text-3xl leading-none font-extrabold tracking-[-0.03em]"
              style={{ color: primary }}
            >
              ShareBite
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-orange-400/20 rounded-[2rem] blur-2xl translate-y-5" />

            <div className="relative bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_28px_70px_rgba(234,88,12,0.16)] p-7 md:p-8">
              {step === 1 ? (
                <>
                  <p
                    className="text-xs font-extrabold uppercase tracking-[0.16em] mb-2"
                    style={{ color: primary }}
                  >
                    Bergabung
                  </p>

                  <h2 className="text-3xl text-[#2F3A56] mb-2 font-extrabold tracking-[-0.03em]">
                    Daftar Sebagai?
                  </h2>

                  <p className="text-sm text-[#7A5C46] mb-7">
                    Pilih peran Anda di platform ShareBite.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        role: "donor",
                        icon: Store,
                        label: "Pendonor",
                        sub: "Restoran, Kafe, Kantin",
                      },
                      {
                        role: "volunteer",
                        icon: Users,
                        label: "Relawan",
                        sub: "Volunteer distribusi",
                      },
                    ].map(({ role: r, icon: Icon, label, sub }) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setStep(2);
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-orange-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white hover:shadow-[0_20px_45px_rgba(234,88,12,0.18)]"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = primary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "")
                        }
                      >
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-100 rounded-full transition-all group-hover:bg-orange-200" />
                        <div className="absolute left-5 top-6 h-8 w-24 rounded-full bg-orange-100/75 transition-all group-hover:bg-orange-200/80" />

                        <div className="relative">
                          <div className="w-13 h-13 rounded-2xl bg-orange-100 flex items-center justify-center mb-5 transition-all group-hover:shadow-[0_12px_25px_rgba(233,125,50,0.25)]">
                            <Icon
                              size={26}
                              className="transition-all"
                              style={{ color: primary }}
                            />
                          </div>

                          <p className="text-[#2F3A56] uppercase text-sm font-extrabold tracking-[0.06em]">
                            {label}
                          </p>

                          <p className="text-xs text-[#7A5C46] mt-1 leading-relaxed">
                            {sub}
                          </p>

                          <div
                            className="mt-5 flex items-center text-xs font-bold opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                            style={{ color: primary }}
                          >
                            Pilih role
                            <ArrowRight size={14} className="ml-1" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-sm text-[#7A5C46] mt-7">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login"
                      className="font-bold hover:underline"
                      style={{ color: primary }}
                    >
                      Masuk
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-1 p-2.5 rounded-2xl bg-orange-100 hover:bg-orange-200 transition-colors"
                      style={{ color: primary }}
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <div>
                      <p
                        className="text-xs font-extrabold uppercase tracking-[0.16em]"
                        style={{ color: primary }}
                      >
                        Langkah 2
                      </p>

                      <h2 className="text-3xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.03em]">
                        Data {role === "donor" ? "Pendonor" : "Relawan"}
                      </h2>

                      <p className="text-sm text-[#7A5C46] mt-1">
                        Lengkapi data akun ShareBite Anda.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handle} className="space-y-4">
                    {inputItems.map(
                      ({
                        label,
                        field,
                        placeholder,
                        required,
                        type = "text",
                        min,
                        icon: Icon,
                      }) => (
                        <div key={field}>
                          <label className={labelClass}>
                            {label} {required && "*"}
                          </label>

                          <div className="relative">
                            <Icon
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type={type}
                              className={inputClass}
                              placeholder={placeholder}
                              required={required}
                              minLength={min}
                              value={form[field]}
                              onChange={(e) =>
                                updateForm(field, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )
                    )}

                    {role === "donor" ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Alamat</label>

                          <div className="relative">
                            <MapPin
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              className={inputClass}
                              placeholder="Jl. Sudirman No. 10"
                              value={form.address}
                              onChange={(e) =>
                                updateForm("address", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Kota</label>

                          <div className="relative">
                            <MapPin
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              className={inputClass}
                              placeholder="Banda Aceh"
                              value={form.city}
                              onChange={(e) =>
                                updateForm("city", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className={labelClass}>Area Aktif</label>

                        <div className="relative">
                          <MapPin
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            className={inputClass}
                            placeholder="Banda Aceh Utara"
                            value={form.area}
                            onChange={(e) => updateForm("area", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 flex items-center justify-center gap-2 mt-2 rounded-2xl font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                      style={{
                        background: primary,
                        boxShadow: "0 14px 28px rgba(233,125,50,0.25)",
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
                      ) : (
                        <>
                          Daftar Sekarang <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}