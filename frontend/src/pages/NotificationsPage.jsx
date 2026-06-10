import { useNotif } from '../context/NotifContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bell, CheckCheck, Circle } from 'lucide-react';

const TYPE_ICONS = { new_donation: '🍱', pickup_accepted: '🤝', distributed: '✅', info: '📢' };

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotif();
  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">Notifikasi</h1>
          <p className="text-gray-400 text-sm">{unreadCount} belum dibaca</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost flex items-center gap-2 text-sm"><CheckCheck size={16}/> Tandai semua dibaca</button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={40} className="mx-auto text-gray-200 mb-4"/>
          <h3 className="font-display font-bold text-lg text-gray-400">Tidak ada notifikasi</h3>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.notif_id} onClick={() => !n.is_read && markRead(n.notif_id)}
              className={`card cursor-pointer flex gap-4 items-start transition-all hover:shadow-warm ${!n.is_read ? 'border-l-4 border-brand-primary bg-orange-50/50' : ''}`}>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{TYPE_ICONS[n.type]||'📢'}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.is_read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: id })}</p>
              </div>
              {!n.is_read && <Circle size={8} className="text-brand-primary fill-brand-primary flex-shrink-0 mt-1.5"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
