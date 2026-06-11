import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  MapPin,
  Building,
  Save,
  LogOut,
  Mail,
  Lock,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  Store,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const isDonor = user?.role === "donor";
  const p = user?.profile || {};

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: p.phone || "",
    address: p.address || "",
    city: p.city || "",
    restaurantName: p.restaurant_name || "",
    area: p.area || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const updatePasswordForm = (field, value) => {
    setPasswordForm({ ...passwordForm, [field]: value });
  };

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/auth/profile", form);
      updateUser({ name: form.name });
      toast.success("Profil diperbarui! ✅");
    } catch {
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Password saat ini wajib diisi");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password berhasil diperbarui ✅");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal memperbarui password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const labelClass =
    "block text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-[0.16em]";

  const inputClass =
    "w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30";

  const readonlyClass =
    "w-full h-14 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 pl-12 text-[15px] font-semibold text-[#7A5C46] outline-none cursor-not-allowed";

  const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder,
    visible,
    onToggle,
  }) => (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={visible ? "text" : "password"}
          className={`${inputClass} pr-12`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#E58A43] transition-colors"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white/80 border border-orange-100 p-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-orange-100/70" />
        <div className="absolute right-24 bottom-[-80px] w-44 h-44 rounded-full bg-orange-200/35" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              Akun
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              Profil Saya
            </h1>

            <p className="text-[#7A5C46] text-sm mt-1">
              Kelola informasi akun dan keamanan ShareBite Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-center h-11 px-5 rounded-2xl border border-red-100 bg-white text-red-400 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-5">
        {/* Left Profile */}
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-white/95 border border-orange-100 p-6 shadow-[0_16px_45px_rgba(229,138,67,0.08)]">
            <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-orange-100/70" />
            <div className="absolute right-12 bottom-[-80px] w-40 h-40 rounded-full bg-orange-200/30" />

            <div className="relative flex flex-col items-center text-center">
              <div
                className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-[0_16px_35px_rgba(229,138,67,0.25)]"
                style={{ background: primary }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>

              <h2 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em] mt-4">
                {user?.name || "User"}
              </h2>

              <div
                className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] bg-[#FFF4EC]"
                style={{ color: primary }}
              >
                {isDonor ? <Store size={14} /> : <Truck size={14} />}
                {isDonor ? "Pendonor" : "Volunteer"}
              </div>

              <p className="text-sm text-[#7A5C46] mt-2 break-all">
                {user?.email}
              </p>

              {!isDonor && p.volunteer_code && (
                <div className="mt-5 w-full rounded-2xl bg-orange-50 border border-orange-100 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] font-extrabold text-slate-500">
                    Kode Volunteer
                  </p>
                  <p
                    className="font-mono font-extrabold text-xl mt-1"
                    style={{ color: primary }}
                  >
                    {p.volunteer_code}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isDonor ? (
              <>
                <div className="rounded-[1.6rem] bg-white/95 border border-orange-100 p-5 text-center shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
                  <Building size={24} className="mx-auto mb-3" style={{ color: primary }} />
                  <p className="font-extrabold text-[#2F3A56] line-clamp-2">
                    {p.restaurant_name || "—"}
                  </p>
                  <p className="text-[11px] text-[#7A5C46] mt-2 uppercase tracking-[0.12em] font-bold">
                    Restoran
                  </p>
                </div>

                <div className="rounded-[1.6rem] bg-white/95 border border-orange-100 p-5 text-center shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
                  <MapPin size={24} className="mx-auto mb-3" style={{ color: primary }} />
                  <p className="font-extrabold text-[#2F3A56] line-clamp-2">
                    {p.city || "—"}
                  </p>
                  <p className="text-[11px] text-[#7A5C46] mt-2 uppercase tracking-[0.12em] font-bold">
                    Kota
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[1.6rem] bg-white/95 border border-orange-100 p-5 text-center shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
                  <Truck size={24} className="mx-auto mb-3" style={{ color: primary }} />
                  <p className="text-2xl font-extrabold" style={{ color: primary }}>
                    {p.total_deliveries || 0}
                  </p>
                  <p className="text-[11px] text-[#7A5C46] mt-2 uppercase tracking-[0.12em] font-bold">
                    Pengiriman
                  </p>
                </div>

                <div className="rounded-[1.6rem] bg-white/95 border border-orange-100 p-5 text-center shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
                  <MapPin size={24} className="mx-auto mb-3" style={{ color: primary }} />
                  <p className="font-extrabold text-[#2F3A56] line-clamp-2">
                    {p.area || "—"}
                  </p>
                  <p className="text-[11px] text-[#7A5C46] mt-2 uppercase tracking-[0.12em] font-bold">
                    Area Aktif
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Forms */}
        <div className="space-y-5">
          {/* Profile Information */}
          <form
            onSubmit={handle}
            className="rounded-[2rem] bg-white/95 border border-orange-100 p-6 shadow-[0_16px_45px_rgba(229,138,67,0.08)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-slate-500" />
                  <p
                    className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: primary }}
                  >
                    Profile Information
                  </p>
                </div>

                <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
                  Informasi Profil
                </h3>

                <p className="text-sm text-[#7A5C46] mt-1">
                  Perbarui data profil yang digunakan di ShareBite.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 px-5 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: primary,
                  boxShadow: "0 14px 28px rgba(229,138,67,0.25)",
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
                    <Save size={16} />
                    Simpan
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={readonlyClass}
                    value={user?.email || ""}
                    readOnly
                  />
                </div>
                <p className="text-xs text-[#7A5C46] mt-1.5">
                  Email digunakan untuk login dan tidak dapat diubah dari halaman ini.
                </p>
              </div>

              <div>
                <label className={labelClass}>No. Telepon</label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className={inputClass}
                    placeholder="0812xxxxxxxx"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                  />
                </div>
              </div>

              {isDonor ? (
                <>
                  <div>
                    <label className={labelClass}>Nama Restoran/Kafe</label>
                    <div className="relative">
                      <Building
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className={inputClass}
                        value={form.restaurantName}
                        onChange={(e) =>
                          updateForm("restaurantName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Alamat</label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className={inputClass}
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Kota</label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className={inputClass}
                        value={form.city}
                        onChange={(e) => updateForm("city", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className={labelClass}>Area Aktif</label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={inputClass}
                      value={form.area}
                      onChange={(e) => updateForm("area", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Security */}
          <form
            onSubmit={handlePasswordChange}
            className="rounded-[2rem] bg-white/95 border border-orange-100 p-6 shadow-[0_16px_45px_rgba(229,138,67,0.08)]"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-slate-500" />
                <p
                  className="text-[11px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: primary }}
                >
                  Security
                </p>
              </div>

              <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
                Ganti Sandi
              </h3>

              <p className="text-sm text-[#7A5C46] mt-1">
                Masukkan password lama sebelum mengatur password baru.
              </p>
            </div>

            <div className="space-y-4">
              <PasswordInput
                label="Password Saat Ini"
                placeholder="Masukkan password saat ini"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  updatePasswordForm("currentPassword", e.target.value)
                }
                visible={showPw.current}
                onToggle={() =>
                  setShowPw({ ...showPw, current: !showPw.current })
                }
              />

              <PasswordInput
                label="Password Baru"
                placeholder="Minimal 6 karakter"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  updatePasswordForm("newPassword", e.target.value)
                }
                visible={showPw.new}
                onToggle={() => setShowPw({ ...showPw, new: !showPw.new })}
              />

              <PasswordInput
                label="Konfirmasi Password Baru"
                placeholder="Ulangi password baru"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  updatePasswordForm("confirmPassword", e.target.value)
                }
                visible={showPw.confirm}
                onToggle={() =>
                  setShowPw({ ...showPw, confirm: !showPw.confirm })
                }
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full h-12 mt-5 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: primary,
                boxShadow: "0 14px 28px rgba(229,138,67,0.25)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = primary)
              }
            >
              {passwordLoading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Simpan Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white border border-orange-100 p-6 shadow-2xl animate-slide-up">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-orange-50 text-[#7A5C46] hover:bg-[#FFF4EC] flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <LogOut size={30} className="text-red-500" />
            </div>

            <h3 className="text-3xl text-[#2F3A56] font-extrabold tracking-[-0.04em] text-center">
              Keluar Akun?
            </h3>

            <p className="text-[#7A5C46] text-sm text-center mt-2">
              Apakah Anda yakin ingin keluar dari akun ShareBite?
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-12 rounded-2xl border border-orange-200 bg-white text-[#7A5C46] font-bold hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="h-12 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}