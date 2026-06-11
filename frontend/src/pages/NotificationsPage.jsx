import React from "react";
import { useNotif } from "../context/NotifContext";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Bell,
  CheckCheck,
  Circle,
  PackageOpen,
  Handshake,
  CheckCircle2,
  Megaphone,
} from "lucide-react";

const TYPE_ICONS = {
  new_donation: PackageOpen,
  pickup_accepted: Handshake,
  distributed: CheckCircle2,
  info: Megaphone,
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotif();

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  const getIcon = (type) => TYPE_ICONS[type] || Megaphone;

  return (
    <div className="space-y-5 animate-slide-up max-w-3xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white/80 border border-orange-100 p-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-orange-100/70" />
        <div className="absolute right-24 bottom-[-80px] w-44 h-44 rounded-full bg-orange-200/35" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_12px_25px_rgba(229,138,67,0.25)]"
              style={{ background: primary }}
            >
              <Bell size={23} />
            </div>

            <div>
              <p
                className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
                style={{ color: primary }}
              >
                Pusat
              </p>

              <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
                Notifikasi
              </h1>

              <p className="text-[#7A5C46] text-sm mt-1">
                {unreadCount} belum dibaca
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center justify-center gap-2 self-start sm:self-center h-11 px-5 rounded-2xl border border-orange-200 bg-white text-[#7A5C46] font-bold hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all"
              onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#7A5C46")
              }
            >
              <CheckCheck size={17} />
              Tandai semua dibaca
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="rounded-[2rem] bg-white/90 border border-orange-100 text-center py-16 shadow-[0_16px_45px_rgba(229,138,67,0.08)]">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
            <Bell size={38} style={{ color: primary }} />
          </div>

          <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
            Tidak Ada Notifikasi
          </h3>

          <p className="text-[#7A5C46] text-sm mt-1">
            Semua notifikasi akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = getIcon(n.type);

            return (
              <div
                key={n.notif_id}
                onClick={() => !n.is_read && markRead(n.notif_id)}
                className={`group relative rounded-[1.7rem] border p-4 flex gap-4 items-start cursor-pointer transition-all ${
                  !n.is_read
                    ? "bg-[#FFF4EC] border-orange-200 shadow-[0_14px_35px_rgba(229,138,67,0.1)]"
                    : "bg-white/95 border-orange-100 shadow-[0_10px_28px_rgba(229,138,67,0.06)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(229,138,67,0.1)]"
                }`}
              >
                {!n.is_read && (
                  <div
                    className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                    style={{ background: primary }}
                  />
                )}

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                  style={{
                    background: n.is_read ? "#FFF7F1" : "#FFFFFF",
                    borderColor: "#FED7AA",
                    color: primary,
                  }}
                >
                  <Icon size={21} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed ${
                      n.is_read
                        ? "text-[#7A5C46]"
                        : "text-[#2F3A56] font-bold"
                    }`}
                  >
                    {n.message}
                  </p>

                  <p className="text-xs text-[#7A5C46] mt-1.5">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </div>

                {!n.is_read && (
                  <Circle
                    size={9}
                    className="flex-shrink-0 mt-2"
                    style={{ color: primary, fill: primary }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}