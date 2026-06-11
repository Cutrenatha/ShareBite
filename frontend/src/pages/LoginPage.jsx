import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Store,
  Users,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const primary = "#E97D32";
  const primaryHover = "#D96E23";

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Selamat datang! 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-orange-300 hover:shadow-sm focus:border-[#E97D32] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30";

  const labelClass =
    "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-[0.13em]";

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
            Welcome back to ShareBite
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-[-0.04em] text-[#2F3A56]">
            Lanjutkan aksi baikmu bersama{" "}
            <span style={{ color: primary }}>ShareBite.</span>
          </h1>

          <p className="mt-4 text-[#7A5C46] leading-relaxed max-w-md">
            Masuk untuk mengelola donasi makanan, melihat aktivitas distribusi,
            dan membantu makanan berlebih sampai ke orang yang membutuhkan.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-3xl bg-white/85 border border-orange-200 p-5 shadow-[0_12px_35px_rgba(234,88,12,0.09)]">
              <Store className="mb-3" size={28} style={{ color: primary }} />
              <p className="font-bold text-[#2F3A56]">Pendonor</p>
              <p className="text-sm text-[#7A5C46] mt-1">
                Kelola donasi makanan.
              </p>
            </div>

            <div className="rounded-3xl bg-white/85 border border-orange-200 p-5 shadow-[0_12px_35px_rgba(234,88,12,0.09)]">
              <Users className="mb-3" size={28} style={{ color: primary }} />
              <p className="font-bold text-[#2F3A56]">Relawan</p>
              <p className="text-sm text-[#7A5C46] mt-1">
                Pantau tugas distribusi.
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

            <div>
              <h1
                className="text-3xl leading-none font-extrabold tracking-[-0.03em]"
                style={{ color: primary }}
              >
                ShareBite
              </h1>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7A5C46] font-semibold mt-1">
                Food Rescue Platform
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-orange-400/20 rounded-[2rem] blur-2xl translate-y-5" />

            <div className="relative bg-white/95 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_28px_70px_rgba(234,88,12,0.16)] p-7 md:p-8">
              <p
                className="text-xs font-extrabold uppercase tracking-[0.16em] mb-2"
                style={{ color: primary }}
              >
                Selamat Datang
              </p>

              <h2 className="text-4xl font-extrabold text-[#2F3A56] tracking-[-0.04em] mb-2">
                Masuk ke Akun
              </h2>

              <p className="text-sm text-[#7A5C46] mb-8">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-bold hover:underline"
                  style={{ color: primary }}
                >
                  Daftar sekarang
                </Link>
              </p>

              <form onSubmit={handle} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      required
                      className={inputClass}
                      placeholder="email@contoh.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPw ? "text" : "password"}
                      required
                      className={`${inputClass} pr-12`}
                      placeholder="Masukkan password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = primary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "")
                      }
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

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
                      Masuk <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 rounded-3xl bg-orange-50 border border-orange-200">
                <p className="text-xs font-extrabold text-[#8A5A36] mb-3 uppercase tracking-[0.12em]">
                  Akun Demo
                </p>

                <div className="space-y-2 text-xs text-[#7A5C46]">
                  <div className="flex items-center gap-2">
                    <Store size={14} style={{ color: primary }} />
                    <span>padang@example.com / password123</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} style={{ color: primary }} />
                    <span>ahmad@example.com / password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}