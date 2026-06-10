const MAP = {
  available: { label: 'Tersedia', cls: 'badge-available' },
  claimed: { label: 'Diklaim', cls: 'badge-claimed' },
  picked_up: { label: 'Dijemput', cls: 'badge-picked_up' },
  distributed: { label: 'Terdistribusi', cls: 'badge-distributed' },
  expired: { label: 'Kadaluarsa', cls: 'badge-expired' },
  assigned: { label: 'Ditugaskan', cls: 'badge-assigned' },
  on_the_way: { label: 'Dalam Perjalanan', cls: 'badge-on_the_way' },
  cancelled: { label: 'Dibatalkan', cls: 'badge-cancelled' },
};
export default function StatusBadge({ status }) {
  const s = MAP[status] || { label: status, cls: 'badge bg-gray-100 text-gray-500' };
  return <span className={s.cls}>{s.label}</span>;
}
