import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotif } from '../context/NotifContext';
import { LayoutDashboard, Gift, Truck, History, Bell, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const donorLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/donations', icon: Gift, label: 'Donasi Saya' },
  { to: '/pickups', icon: Truck, label: 'Monitor Pickup' },
  { to: '/history', icon: History, label: 'Riwayat' },
];
const volLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/donations', icon: Gift, label: 'Donasi Tersedia' },
  { to: '/pickups', icon: Truck, label: 'Tugas Pickup' },
  { to: '/history', icon: History, label: 'Riwayat' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotif();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = user?.role === 'donor' ? donorLinks : volLinks;

  const doLogout = () => { logout(); navigate('/login'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-xl shadow-warm">🍱</div>
          <div><h1 className="font-display font-black text-brand-primary text-xl">ShareBite</h1><p className="text-xs text-gray-400">Food Rescue Platform</p></div>
        </div>
      </div>
      <div className="px-4 py-4 border-b border-orange-100">
        <div className="flex items-center gap-3 bg-brand-light rounded-xl p-3">
          <div className="w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-brand-primary font-medium">{user?.role === 'donor' ? '🏪 Pendonor' : '🤝 Volunteer'}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Menu</p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /><span className="flex-1">{label}</span><ChevronRight size={14} className="opacity-30" />
          </NavLink>
        ))}
        <div className="pt-2 border-t border-gray-100 mt-2">
          <NavLink to="/notifications" onClick={() => setOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} /><span className="flex-1">Notifikasi</span>
            {unreadCount > 0 && <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </NavLink>
          <NavLink to="/profile" onClick={() => setOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <User size={18} /><span className="flex-1">Profil</span><ChevronRight size={14} className="opacity-30" />
          </NavLink>
        </div>
      </nav>
      <div className="px-4 py-4 border-t border-orange-100">
        <button onClick={doLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"><LogOut size={18} /><span>Keluar</span></button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r border-orange-100 flex-col flex-shrink-0"><Sidebar /></aside>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-2xl">
            <button className="absolute top-4 right-4 text-gray-400" onClick={() => setOpen(false)}><X size={22} /></button>
            <Sidebar />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white border-b border-orange-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)}><Menu size={22} className="text-gray-600" /></button>
          <span className="text-xl">🍱</span><span className="font-display font-black text-brand-primary text-lg">ShareBite</span>
          <NavLink to="/notifications" className="relative ml-auto">
            <Bell size={20} className="text-gray-500" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
          </NavLink>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
}
