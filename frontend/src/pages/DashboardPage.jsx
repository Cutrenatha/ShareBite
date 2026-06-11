import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Gift,
  Truck,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Store,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  useEffect(() => {
    api
      .get("/reports/dashboard")
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-orange-100 rounded-2xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-3xl border border-orange-100"
            />
          ))}
        </div>
      </div>
    );

  const isDonor = user?.role === "donor";
  const stats = data?.stats || {};

  const monthly = (data?.monthly || [])
    .map((m) => ({
      bulan: m.month
        ? m.month.substring(5, 7) + "/" + m.month.substring(2, 4)
        : "-",
      jumlah: parseInt(m.count),
    }))
    .reverse();

  const recent = data?.recent || [];

  const statCards = isDonor
    ? [
        {
          icon: Gift,
          label: "Total Donasi",
          value: stats.total_donations || 0,
          color: primary,
          bg: "#FFF4EC",
          desc: "semua waktu",
        },
        {
          icon: TrendingUp,
          label: "Aktif",
          value: stats.active_donations || 0,
          color: "#059669",
          bg: "#ECFDF5",
          desc: "tersedia sekarang",
        },
        {
          icon: Truck,
          label: "Terdistribusi",
          value: stats.completed_donations || 0,
          color: "#2563EB",
          bg: "#EFF6FF",
          desc: "selesai",
        },
        {
          icon: Users,
          label: "Penerima",
          value: stats.total_recipients || 0,
          color: "#7C3AED",
          bg: "#F5F3FF",
          desc: "orang terbantu",
        },
      ]
    : [
        {
          icon: Truck,
          label: "Total Pickup",
          value: stats.total_pickups || 0,
          color: primary,
          bg: "#FFF4EC",
          desc: "semua waktu",
        },
        {
          icon: TrendingUp,
          label: "Selesai",
          value: stats.completed_pickups || 0,
          color: "#059669",
          bg: "#ECFDF5",
          desc: "berhasil",
        },
        {
          icon: Clock,
          label: "Aktif",
          value: stats.active_pickups || 0,
          color: "#2563EB",
          bg: "#EFF6FF",
          desc: "sedang berjalan",
        },
        {
          icon: Users,
          label: "Penerima",
          value: stats.total_recipients_helped || 0,
          color: "#7C3AED",
          bg: "#F5F3FF",
          desc: "orang dibantu",
        },
      ];

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.6rem] bg-white/80 border border-orange-100 p-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-orange-100/70" />
        <div className="absolute right-16 bottom-[-80px] w-40 h-40 rounded-full bg-orange-200/35" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              Halo, {user?.name?.split(" ")[0] || "User"}!
            </h1>

            <p className="text-[#7A5C46] text-sm mt-0.5">
              {isDonor
                ? "Kelola donasi makanan Anda hari ini."
                : "Lihat tugas pickup yang tersedia hari ini."}
            </p>
          </div>

          {isDonor && (
            <Link
              to="/donations/new"
              className="inline-flex items-center justify-center gap-2 self-start sm:self-center h-11 px-5 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all"
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
              <Plus size={17} />
              Buat Donasi
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg, desc }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-[1.4rem] bg-white/90 border border-orange-100 p-4 shadow-[0_12px_30px_rgba(229,138,67,0.07)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(229,138,67,0.12)] transition-all"
          >
            <div
              className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-70"
              style={{ background: bg }}
            />

            <div className="relative">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: bg }}
              >
                <Icon size={19} style={{ color }} />
              </div>

              <p
                className="text-3xl font-extrabold leading-none tracking-[-0.04em]"
                style={{ color }}
              >
                {value}
              </p>

              <p className="font-extrabold text-sm text-[#2F3A56] mt-1.5">
                {label}
              </p>

              <p className="text-xs text-[#7A5C46] mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + recent */}
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="rounded-[1.6rem] bg-white/90 border border-orange-100 p-5 shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
          <p
            className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
            style={{ color: primary }}
          >
            {isDonor ? "Aktivitas Donasi" : "Aktivitas Pickup"}
          </p>

          <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.04em] mb-3">
            6 Bulan Terakhir
          </h3>

          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE7D8" />
                <XAxis
                  dataKey="bulan"
                  tick={{
                    fontSize: 11,
                    fill: "#7A5C46",
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#7A5C46",
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#FFF4EC" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #F4D4B4",
                    boxShadow: "0 14px 35px rgba(229,138,67,0.13)",
                    color: "#2F3A56",
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="jumlah" radius={[10, 10, 0, 0]}>
                  {monthly.map((_, index) => (
                    <Cell key={index} fill={primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[170px] flex items-center justify-center flex-col gap-2 rounded-3xl bg-orange-50 border border-orange-100">
              <Store size={32} style={{ color: primary }} />
              <p className="text-sm font-semibold text-[#7A5C46]">
                Belum ada data
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[1.6rem] bg-white/90 border border-orange-100 p-5 shadow-[0_12px_30px_rgba(229,138,67,0.07)]">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p
                className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
                style={{ color: primary }}
              >
                Terbaru
              </p>

              <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.04em]">
                Aktivitas
              </h3>
            </div>

            <Link
              to={isDonor ? "/donations" : "/pickups"}
              className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
              style={{ color: primary }}
            >
              Lihat semua <ArrowRight size={15} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="h-[170px] flex items-center justify-center flex-col gap-2 rounded-3xl bg-orange-50 border border-orange-100">
              <Gift size={32} style={{ color: primary }} />
              <p className="text-sm font-semibold text-[#7A5C46]">
                Belum ada aktivitas
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[170px] overflow-hidden">
              {recent.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-3 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-orange-50/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-orange-100 flex-shrink-0">
                    <Store size={18} style={{ color: primary }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sm text-[#2F3A56] truncate">
                      {item.food_name}
                    </p>

                    <p className="text-xs text-[#7A5C46] mt-0.5 truncate">
                      {item.pickup_location || item.restaurant_name}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <p className="text-[10px] text-[#7A5C46] whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}