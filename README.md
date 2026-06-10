# 🍱 ShareBite — Food Rescue Platform Berbasis Microservices

## ⚙️ Persyaratan
- **Node.js v22.5 atau lebih baru** (Node v24 ✅)
- Windows / macOS / Linux
- **Tidak perlu Visual Studio, tidak perlu install SQLite** — menggunakan `node:sqlite` built-in Node.js

## 📁 Struktur Proyek
```
sharebite/
├── backend/
│   ├── auth-service/          # Autentikasi (port 5001)
│   ├── donation-service/      # Manajemen donasi (port 5002)
│   ├── delivery-service/      # Pickup & distribusi (port 5003)
│   ├── notification-service/  # Notifikasi + Socket.IO (port 5004)
│   ├── reporting-service/     # Laporan & riwayat (port 5005)
│   ├── gateway/               # API Gateway (port 5000)
│   ├── data/                  # Database SQLite (auto-dibuat)
│   ├── db.js                  # Koneksi database
│   └── .env                   # Konfigurasi
├── frontend/                  # React + Vite + Tailwind (port 5173)
├── scripts/init-db.js         # Inisialisasi database
├── start-all.js               # Jalankan semua backend
└── package.json
```

## 🚀 Cara Menjalankan

### Langkah 1 — Install dependencies
```
npm run install:all
```

### Langkah 2 — Inisialisasi database
```
npm run init:db
```

### Langkah 3 — Jalankan backend
```
npm start
```
Biarkan terminal ini tetap berjalan.

### Langkah 4 — Jalankan frontend (terminal baru)
```
cd frontend
npm run dev
```
Buka browser: **http://localhost:5173**

---

## 👤 Akun Demo

| Role           | Email                   | Password     |
|----------------|-------------------------|--------------|
| 🏪 Donor 1     | padang@example.com      | password123  |
| 🏪 Donor 2     | nusantara@example.com   | password123  |
| 🤝 Volunteer 1 | ahmad@example.com       | password123  |
| 🤝 Volunteer 2 | siti@example.com        | password123  |

---

## 🛠️ Tech Stack
| Kategori    | Teknologi                                  |
|-------------|--------------------------------------------|
| Frontend    | React.js, Tailwind CSS, Vite               |
| Backend     | Node.js, Express.js                        |
| Database    | SQLite via `node:sqlite` (built-in Node)   |
| Auth        | JWT (jsonwebtoken + bcryptjs)              |
| Realtime    | Socket.IO                                  |
| Arsitektur  | Microservices + API Gateway                |
