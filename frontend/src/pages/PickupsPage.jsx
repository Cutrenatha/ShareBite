import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import {
  MapPin,
  Clock,
  User,
  Phone,
  RefreshCw,
  ChevronDown,
  Check,
  Store,
  PackageOpen,
  X,
  Users,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const FLOW = {
  assigned: { next: "on_the_way", label: "Mulai Perjalanan" },
  on_the_way: { next: "picked_up", label: "Konfirmasi Penjemputan" },
  picked_up: {
    next: "distributed",
    label: "Selesai Distribusi",
    needsCount: true,
  },
};

export default function PickupsPage() {
  const { user } = useAuth();
  const isDonor = user?.role === "donor";

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [recipientCount, setRecipientCount] = useState("");
  const [notes, setNotes] = useState("");

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "assigned", label: "Ditugaskan" },
    { value: "on_the_way", label: "Dalam Perjalanan" },
    { value: "picked_up", label: "Sudah Dijemput" },
    { value: "distributed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const selectedStatus =
    statusOptions.find((item) => item.value === filterStatus)?.label ||
    "Semua Status";

  const load = () => {
    setLoading(true);

    api
      .get(`/delivery/pickups${filterStatus ? `?status=${filterStatus}` : ""}`)
      .then((r) => setPickups(r.data.pickups))
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filterStatus]);

  const updateStatus = async (pickupId, status, count, notesVal) => {
    setUpdating(pickupId);

    try {
      await api.put(`/delivery/status/${pickupId}`, {
        status,
        recipientCount: count,
        notes: notesVal,
      });

      toast.success("Status diperbarui ✅");
      setModal(null);
      setRecipientCount("");
      setNotes("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleAction = (pickup) => {
    const flow = FLOW[pickup.status];
    if (!flow) return;

    if (flow.needsCount) {
      setModal(pickup);
      return;
    }

    updateStatus(pickup.pickup_id, flow.next, null, null);
  };

  const inputClass =
    "w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30";

  const textareaClass =
    "w-full min-h-[88px] rounded-2xl border border-orange-200 bg-white px-4 py-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30 resize-none";

  const labelClass =
    "block text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-[0.16em]";

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="relative z-20 rounded-[1.8rem] bg-white/80 border border-orange-100 p-5 shadow-[0_16px_40px_rgba(229,138,67,0.07)]">
        <div className="absolute inset-0 overflow-hidden rounded-[1.8rem] pointer-events-none">
          <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-orange-100/70" />
          <div className="absolute right-24 bottom-[-80px] w-44 h-44 rounded-full bg-orange-200/35" />
        </div>

        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              {isDonor ? "Pantau" : "Kelola"}
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              {isDonor ? "Monitor Pickup" : "Tugas Pickup Saya"}
            </h1>

            <p className="text-[#7A5C46] text-sm mt-1">
              {pickups.length} pickup ditemukan
            </p>
          </div>

          <div className="relative z-50 flex gap-3">
            <div className="relative w-56">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full h-12 rounded-2xl border border-orange-200 bg-white px-4 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 flex items-center justify-between"
              >
                <span>{selectedStatus}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-[9999] w-full overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_18px_40px_rgba(229,138,67,0.18)]">
                  {statusOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setFilterStatus(item.value);
                        setFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all ${
                        filterStatus === item.value
                          ? "bg-[#FFF4EC]"
                          : "text-[#2F3A56] hover:bg-[#FFF4EC]"
                      }`}
                      style={{
                        color:
                          filterStatus === item.value ? primary : undefined,
                      }}
                    >
                      <span>{item.label}</span>
                      {filterStatus === item.value && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={load}
              className="w-12 h-12 rounded-2xl border border-orange-200 bg-white flex items-center justify-center hover:bg-[#FFF4EC] hover:border-[#E58A43] hover:shadow-sm transition-all"
              style={{ color: primary }}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-[1.8rem] animate-pulse bg-white/80 border border-orange-100"
              />
            ))}
          </div>
        ) : pickups.length === 0 ? (
          <div className="rounded-[2rem] bg-white/90 border border-orange-100 text-center py-16 shadow-[0_16px_45px_rgba(229,138,67,0.08)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
              <PackageOpen size={38} style={{ color: primary }} />
            </div>

            <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
              Tidak Ada Pickup
            </h3>

            <p className="text-[#7A5C46] text-sm mt-1">
              {isDonor
                ? "Belum ada relawan yang mengambil donasi Anda."
                : "Belum ada tugas pickup saat ini."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pickups.map((p) => (
              <div
                key={p.pickup_id}
                className="group rounded-[2rem] bg-white/95 border border-orange-100 p-5 shadow-[0_16px_45px_rgba(229,138,67,0.08)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(229,138,67,0.13)] transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div className="flex gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                      <Store size={26} style={{ color: primary }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <h3 className="text-xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
                          {p.food_name}
                        </h3>

                        <StatusBadge status={p.status} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#7A5C46]">
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin
                            size={15}
                            style={{ color: primary }}
                            className="flex-shrink-0"
                          />
                          <span className="truncate">{p.pickup_location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock
                            size={15}
                            style={{ color: primary }}
                            className="flex-shrink-0"
                          />
                          <span>
                            {format(
                              new Date(p.created_at),
                              "dd MMM yyyy, HH:mm",
                              { locale: id }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User
                            size={15}
                            style={{ color: primary }}
                            className="flex-shrink-0"
                          />
                          <span className="truncate">
                            {isDonor ? p.volunteer_name : p.restaurant_name}
                          </span>
                        </div>

                        {(isDonor ? p.volunteer_phone : p.donor_phone) && (
                          <div className="flex items-center gap-2">
                            <Phone
                              size={15}
                              style={{ color: primary }}
                              className="flex-shrink-0"
                            />
                            <a
                              href={`tel:${
                                isDonor ? p.volunteer_phone : p.donor_phone
                              }`}
                              className="hover:underline font-bold"
                              style={{ color: primary }}
                            >
                              {isDonor ? p.volunteer_phone : p.donor_phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {p.notes && (
                        <p className="text-sm text-[#7A5C46] mt-3 italic">
                          Catatan: {p.notes}
                        </p>
                      )}

                      {p.distributed_at && (
                        <p className="text-sm text-emerald-600 font-bold mt-2">
                          Selesai:{" "}
                          {format(
                            new Date(p.distributed_at),
                            "dd MMM yyyy, HH:mm"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isDonor && FLOW[p.status] && (
                    <div className="flex-shrink-0 flex flex-col gap-2 xl:min-w-[210px]">
                      <button
                        onClick={() => handleAction(p)}
                        disabled={updating === p.pickup_id}
                        className="h-11 px-5 rounded-2xl text-white font-bold hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
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
                        {updating === p.pickup_id ? (
                          <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          FLOW[p.status].label
                        )}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(p.pickup_id, "cancelled", null, null)
                        }
                        className="h-10 rounded-2xl border border-red-100 bg-white text-red-400 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all text-sm"
                      >
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl animate-slide-up border border-orange-100">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-orange-50 text-[#7A5C46] hover:bg-[#FFF4EC] flex items-center justify-center transition-all"
              onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#7A5C46")
              }
            >
              <X size={18} />
            </button>

            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.16em] mb-1"
              style={{ color: primary }}
            >
              Konfirmasi
            </p>

            <h3 className="text-3xl text-[#2F3A56] font-extrabold tracking-[-0.04em] mb-1">
              Selesai Distribusi
            </h3>

            <p className="text-[#7A5C46] text-sm mb-5">
              Donasi:{" "}
              <strong className="text-[#2F3A56]">{modal.food_name}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Jumlah Penerima</label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="Berapa orang yang menerima?"
                    value={recipientCount}
                    onChange={(e) => setRecipientCount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Catatan Opsional</label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    rows={2}
                    className={textareaClass}
                    placeholder="Kondisi distribusi, dll."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="h-12 rounded-2xl border border-orange-200 bg-white text-[#7A5C46] font-bold hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#7A5C46")
                }
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() =>
                  updateStatus(
                    modal.pickup_id,
                    "distributed",
                    recipientCount,
                    notes
                  )
                }
                disabled={updating === modal.pickup_id}
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
                {updating === modal.pickup_id ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  "Selesai"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}