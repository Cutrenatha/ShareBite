import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotif } from "../context/NotifContext";
import {
  LayoutDashboard,
  Gift,
  Truck,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
} from "lucide-react";
import React, { useState } from "react";

const donorLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/donations", icon: Gift, label: "Donasi Saya" },
  { to: "/pickups", icon: Truck, label: "Monitor Pickup" },
  { to: "/history", icon: History, label: "Riwayat" },
];

const volLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/donations", icon: Gift, label: "Donasi Tersedia" },
  { to: "/pickups", icon: Truck, label: "Tugas Pickup" },
  { to: "/history", icon: History, label: "Riwayat" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotif();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const primary = "#E58A43";
  const primaryHover = "#D97E38";
  const links = user?.role === "donor" ? donorLinks : volLinks;

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarLinkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
      isActive
        ? "text-white shadow-[0_14px_30px_rgba(229,138,67,0.35)]"
        : "text-[#7A5C46] hover:bg-[#FFF4EC]"
    }`;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-5 py-5 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-[0_10px_22px_rgba(229,138,67,0.22)]"
            style={{ background: primary }}
          >
            <Store size={20} className="text-white" />
          </div>

          <div>
            <h1
              className="text-2xl leading-none font-extrabold tracking-[-0.04em]"
              style={{ color: primary }}
            >
              ShareBite
            </h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A5C46] font-bold mt-1">
              Food Rescue Platform
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-orange-100">
        <div className="flex items-center gap-3 rounded-2xl bg-[#FFF7F1] border border-orange-100 px-3 py-3 shadow-sm">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-[0_8px_18px_rgba(229,138,67,0.22)]"
            style={{ background: primary }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#2F3A56] truncate">
              {user?.name || "User"}
            </p>
            <p
              className="text-[10px] font-extrabold uppercase tracking-[0.1em] mt-0.5"
              style={{ color: primary }}
            >
              {user?.role === "donor" ? "Pendonor" : "Volunteer"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 py-5 space-y-1 overflow-y-auto">
        <p
          className="px-4 mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em]"
          style={{ color: primary }}
        >
          Menu
        </p>

        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={sidebarLinkClass}
            style={({ isActive }) => ({
              background: isActive
                ? "linear-gradient(135deg,#E58A43 0%,#D97E38 100%)"
                : undefined,
              border: isActive
                ? "1px solid rgba(255,255,255,0.15)"
                : undefined,
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.color = primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
            }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white drop-shadow-sm"
                      : "text-[#9A6A45]"
                  }
                />
                <span
                  className={`flex-1 ${
                    isActive ? "text-white font-extrabold" : ""
                  }`}
                >
                  {label}
                </span>
                <ChevronRight
                  size={14}
                  className={`transition-transform group-hover:translate-x-1 ${
                    isActive ? "text-white/70" : "text-orange-300"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-orange-100 space-y-1">
          <NavLink
            to="/notifications"
            onClick={() => setOpen(false)}
            className={sidebarLinkClass}
            style={({ isActive }) => ({
              background: isActive
                ? "linear-gradient(135deg,#E58A43 0%,#D97E38 100%)"
                : undefined,
              border: isActive
                ? "1px solid rgba(255,255,255,0.15)"
                : undefined,
            })}
          >
            {({ isActive }) => (
              <>
                <Bell
                  size={18}
                  className={isActive ? "text-white" : "text-[#9A6A45]"}
                />
                <span className="flex-1">Notifikasi</span>

                {unreadCount > 0 ? (
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "#fff" : primary,
                      color: isActive ? primary : "#fff",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : (
                  <ChevronRight
                    size={14}
                    className={`transition-transform group-hover:translate-x-1 ${
                      isActive ? "text-white/70" : "text-orange-300"
                    }`}
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={sidebarLinkClass}
            style={({ isActive }) => ({
              background: isActive
                ? "linear-gradient(135deg,#E58A43 0%,#D97E38 100%)"
                : undefined,
              border: isActive
                ? "1px solid rgba(255,255,255,0.15)"
                : undefined,
            })}
          >
            {({ isActive }) => (
              <>
                <User
                  size={18}
                  className={isActive ? "text-white" : "text-[#9A6A45]"}
                />
                <span className="flex-1">Profil</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform group-hover:translate-x-1 ${
                    isActive ? "text-white/70" : "text-orange-300"
                  }`}
                />
              </>
            )}
          </NavLink>
        </div>
      </nav>

      <div className="px-5 py-5 border-t border-orange-100">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="group flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut
            size={18}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 18% 16%, rgba(255, 165, 92, 0.18) 0%, transparent 28%), radial-gradient(circle at 88% 12%, rgba(255, 111, 32, 0.13) 0%, transparent 26%), linear-gradient(135deg, #FFF7F1 0%, #FFF0E6 45%, #FFEFE2 100%)",
      }}
    >
      <aside className="hidden md:flex w-64 bg-white border-r border-orange-100 flex-col flex-shrink-0 shadow-[12px_0_35px_rgba(229,138,67,0.05)]">
        <Sidebar />
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="relative w-72 bg-white h-full shadow-2xl">
            <button
              className="absolute top-4 right-4 z-10 text-[#7A5C46] p-2 rounded-xl hover:bg-orange-50 transition-colors"
              style={{ color: primary }}
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>

            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white/95 backdrop-blur-md border-b border-orange-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-orange-50 transition-colors"
          >
            <Menu size={22} className="text-[#7A5C46]" />
          </button>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_8px_18px_rgba(229,138,67,0.22)]"
            style={{ background: primary }}
          >
            <Store size={19} className="text-white" />
          </div>

          <span
            className="text-2xl leading-none font-extrabold tracking-[-0.03em]"
            style={{ color: primary }}
          >
            ShareBite
          </span>

          <NavLink to="/notifications" className="relative ml-auto p-2">
            <Bell size={20} className="text-[#7A5C46]" />

            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: primary }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
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
                onClick={doLogout}
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