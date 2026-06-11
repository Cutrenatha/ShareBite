import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  User,
  Users,
  FileText,
  MapPin,
  History,
  CheckCircle2,
  PackageOpen,
} from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const isDonor = user?.role === "donor";

  const primary = "#E58A43";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reports/history")
      .then((r) => setHistory(r.data.history))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white/80 border border-orange-100 p-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-orange-100/70" />
        <div className="absolute right-24 bottom-[-80px] w-44 h-44 rounded-full bg-orange-200/35" />

        <div className="relative flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_12px_25px_rgba(229,138,67,0.25)]"
            style={{ background: primary }}
          >
            <History size={23} />
          </div>

          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              Rekap
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              Riwayat Distribusi
            </h1>

            <p className="text-[#7A5C46] text-sm mt-1">
              {history.length} riwayat ditemukan
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-[1.8rem] animate-pulse bg-white/80 border border-orange-100"
            />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-[2rem] bg-white/90 border border-orange-100 text-center py-16 shadow-[0_16px_45px_rgba(229,138,67,0.08)]">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
            <PackageOpen size={38} style={{ color: primary }} />
          </div>

          <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
            Belum Ada Riwayat
          </h3>

          <p className="text-[#7A5C46] text-sm mt-1">
            Riwayat distribusi akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div
              key={h.report_id}
              className="group rounded-[2rem] bg-white/95 border border-orange-100 p-5 shadow-[0_16px_45px_rgba(229,138,67,0.08)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(229,138,67,0.13)] transition-all"
            >
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={28} className="text-emerald-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <h3 className="text-xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
                      {h.food_name}
                    </h3>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-extrabold">
                      <CheckCircle2 size={13} />
                      Terdistribusi
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#7A5C46]">
                    <div className="flex items-center gap-2 min-w-0">
                      <User
                        size={15}
                        style={{ color: primary }}
                        className="flex-shrink-0"
                      />
                      <span className="truncate">
                        {isDonor ? h.volunteer_name : h.donor_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users
                        size={15}
                        style={{ color: primary }}
                        className="flex-shrink-0"
                      />
                      <span>{h.recipient_count} penerima</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText
                        size={15}
                        style={{ color: primary }}
                        className="flex-shrink-0"
                      />
                      <span>
                        {format(new Date(h.distributed_at), "dd MMM yyyy, HH:mm", {
                          locale: id,
                        })}
                      </span>
                    </div>

                    {h.donor_address && (
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin
                          size={15}
                          style={{ color: primary }}
                          className="flex-shrink-0"
                        />
                        <span className="truncate">{h.donor_address}</span>
                      </div>
                    )}
                  </div>

                  {h.notes && (
                    <p className="text-sm text-[#7A5C46] mt-3 italic leading-relaxed">
                      “{h.notes}”
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}