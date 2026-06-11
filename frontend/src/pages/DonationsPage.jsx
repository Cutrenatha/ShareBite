import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import {
  Plus,
  MapPin,
  Clock,
  Users,
  Pencil,
  Trash2,
  ChevronRight,
  Search,
  ChevronDown,
  Check,
  Store,
  PackageOpen,
} from "lucide-react";
import { format, isPast } from "date-fns";

export default function DonationsPage() {
  const { user } = useAuth();
  const isDonor = user?.role === "donor";

  const primary = "#E58A43";
  const primaryHover = "#D97E38";

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [accepting, setAccepting] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "available", label: "Tersedia" },
    { value: "claimed", label: "Diklaim" },
    { value: "picked_up", label: "Dijemput" },
    { value: "distributed", label: "Terdistribusi" },
  ];

  const selectedStatus =
    statusOptions.find((item) => item.value === filter)?.label ||
    "Semua Status";

  const load = () => {
    setLoading(true);

    api
      .get(`/donations${filter ? `?status=${filter}` : ""}`)
      .then((r) => setDonations(r.data.donations))
      .catch(() => toast.error("Gagal memuat donasi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus donasi ini?")) return;

    try {
      await api.delete(`/donations/${id}`);
      toast.success("Donasi dihapus");
      load();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const handleAccept = async (donationId) => {
    setAccepting(donationId);

    try {
      await api.post(`/delivery/accept/${donationId}`);
      toast.success("Pickup diterima! 🎉");
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menerima pickup");
    } finally {
      setAccepting(null);
    }
  };

  const filtered = donations.filter(
    (d) =>
      d.food_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.pickup_location?.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-slide-up">
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
              {isDonor ? "Kelola" : "Jelajahi"}
            </p>

            <h1 className="text-3xl md:text-4xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.04em]">
              {isDonor ? "Donasi Saya" : "Donasi Tersedia"}
            </h1>

            <p className="text-[#7A5C46] text-sm mt-1">
              {filtered.length} donasi ditemukan
            </p>
          </div>

          {isDonor && (
            <Link
              to="/donations/new"
              className="inline-flex items-center justify-center gap-2 self-start sm:self-center h-12 px-6 rounded-2xl text-white font-bold transition-all hover:-translate-y-0.5"
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
              <Plus size={18} />
              Buat Donasi Baru
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 pl-12 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all placeholder:text-slate-400 hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 focus:bg-orange-50/30"
            placeholder="Cari donasi, restoran, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isDonor && (
          <div className="relative w-full lg:w-56">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full h-14 rounded-2xl border border-orange-200 bg-white px-4 text-[15px] font-semibold text-[#2F3A56] outline-none transition-all hover:border-[#E58A43] hover:shadow-sm focus:border-[#E58A43] focus:ring-4 focus:ring-orange-200/50 flex items-center justify-between"
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
              <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-[0_18px_40px_rgba(229,138,67,0.16)]">
                {statusOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setFilter(item.value);
                      setFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all ${
                      filter === item.value
                        ? "bg-[#FFF4EC]"
                        : "text-[#2F3A56] hover:bg-[#FFF4EC]"
                    }`}
                    style={{
                      color: filter === item.value ? primary : undefined,
                    }}
                  >
                    <span>{item.label}</span>
                    {filter === item.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-[1.8rem] animate-pulse bg-white/80 border border-orange-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[2rem] bg-white/90 border border-orange-100 text-center py-16 shadow-[0_16px_45px_rgba(229,138,67,0.08)]">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
            <PackageOpen size={38} style={{ color: primary }} />
          </div>

          <h3 className="text-2xl text-[#2F3A56] font-extrabold tracking-[-0.03em]">
            Tidak Ada Donasi
          </h3>

          <p className="text-[#7A5C46] text-sm mt-1">
            {isDonor
              ? "Mulai buat donasi makanan Anda."
              : "Belum ada donasi tersedia saat ini."}
          </p>

          {isDonor && (
            <Link
              to="/donations/new"
              className="mt-5 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl text-white font-bold transition-all hover:-translate-y-0.5"
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
              <Plus size={18} />
              Buat Donasi
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((d) => {
            const expired = isPast(new Date(d.expired_at));

            return (
              <div
                key={d.donation_id}
                className="group overflow-hidden rounded-[2rem] bg-white/95 border border-orange-100 p-5 shadow-[0_16px_45px_rgba(229,138,67,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(229,138,67,0.13)] transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 rounded-[1.5rem] mb-5 flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/70 border border-orange-100">
                  {d.food_image ? (
                    <img
                      src={`http://localhost:5002${d.food_image}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={d.food_name}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-3xl bg-white border border-orange-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Store size={30} style={{ color: primary }} />
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <StatusBadge status={d.status} />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl text-[#2F3A56] leading-tight font-extrabold tracking-[-0.03em] line-clamp-1">
                    {d.food_name}
                  </h3>

                  {d.restaurant_name && (
                    <p
                      className="mt-2 text-sm font-bold flex items-center gap-2"
                      style={{ color: primary }}
                    >
                      <Store size={15} />
                      <span className="truncate">{d.restaurant_name}</span>
                    </p>
                  )}

                  <div className="mt-4 space-y-2.5 text-sm text-[#7A5C46]">
                    <div className="flex items-center gap-2">
                      <Users size={15} style={{ color: primary }} />
                      <span>
                        {d.quantity} {d.unit || "porsi"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={15} style={{ color: primary }} />
                      <span className="truncate">{d.pickup_location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={15} style={{ color: primary }} />
                      <span
                        className={
                          expired
                            ? "text-red-500 font-extrabold"
                            : "font-semibold"
                        }
                      >
                        Exp: {format(new Date(d.expired_at), "dd MMM, HH:mm")}
                      </span>
                    </div>
                  </div>

                  {d.description && (
                    <p className="text-sm text-[#7A5C46] mt-4 line-clamp-2 italic leading-relaxed">
                      {d.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-orange-100 flex gap-3 flex-wrap">
                  {isDonor ? (
                    <>
                      {d.status === "available" && (
                        <Link
                          to={`/donations/edit/${d.donation_id}`}
                          className="h-10 px-4 rounded-2xl border border-orange-200 bg-white text-[#7A5C46] font-bold hover:bg-[#FFF4EC] hover:border-[#E58A43] transition-all flex items-center gap-2 text-sm"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = primary)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#7A5C46")
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                      )}

                      {d.status === "available" && (
                        <button
                          onClick={() => handleDelete(d.donation_id)}
                          className="h-10 px-4 rounded-2xl border border-red-100 bg-white text-red-400 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-2 text-sm"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      )}
                    </>
                  ) : (
                    d.status === "available" &&
                    !expired && (
                      <button
                        onClick={() => handleAccept(d.donation_id)}
                        disabled={accepting === d.donation_id}
                        className="w-full h-11 rounded-2xl text-white font-bold transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        {accepting === d.donation_id ? (
                          <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Ambil Tugas <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}