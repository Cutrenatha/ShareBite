# 🍱 ShareBite — Food Rescue Platform Berbasis Microservices

ShareBite adalah platform berbagi makanan berbasis web yang menghubungkan **pendonor makanan** (restoran, kafe, kantin, dan UMKM kuliner) dengan **relawan distribusi** untuk membantu menyalurkan makanan berlebih kepada masyarakat yang membutuhkan.

Aplikasi ini dikembangkan menggunakan arsitektur **Microservices** sehingga setiap layanan utama berjalan secara terpisah namun tetap saling terintegrasi melalui API Gateway.

---

## ✨ Fitur Utama

### 👤 Autentikasi Pengguna

* Registrasi akun sebagai Pendonor atau Relawan
* Login menggunakan email dan password
* JWT Authentication
* Edit profil pengguna
* Ganti password
* Logout akun

---

### 🏪 Fitur Pendonor

* Membuat donasi makanan baru
* Upload foto makanan
* Menentukan jumlah dan satuan makanan
* Menentukan lokasi penjemputan
* Menentukan batas waktu konsumsi
* Menambahkan deskripsi makanan
* Melihat daftar donasi yang telah dibuat
* Mengedit donasi
* Menghapus donasi
* Memantau proses pickup
* Melihat riwayat distribusi

---

### 🤝 Fitur Relawan

* Melihat daftar donasi yang tersedia
* Mengambil tugas pickup
* Memantau tugas pickup aktif
* Mengubah status distribusi
* Menambahkan laporan distribusi
* Melihat riwayat tugas yang telah selesai

---

### 🔔 Sistem Notifikasi

* Notifikasi donasi baru
* Notifikasi pickup diterima
* Notifikasi distribusi selesai
* Tandai notifikasi sebagai dibaca
* Tandai semua notifikasi sebagai dibaca

---

### 📊 Dashboard & Monitoring

* Statistik total donasi
* Statistik donasi aktif
* Statistik distribusi selesai
* Statistik jumlah penerima
* Grafik aktivitas donasi
* Aktivitas terbaru
* Monitoring pickup secara real-time

---

## 🏗️ Arsitektur Sistem

ShareBite menggunakan pendekatan **Microservices Architecture**.

```text
Frontend (React + Vite)
          │
          ▼
    API Gateway
          │
 ┌────────┼────────┬────────┬────────┬────────┐
 ▼        ▼        ▼        ▼        ▼
Auth   Donation Delivery Notification Reporting
Service Service  Service   Service     Service
```

Seluruh request dari frontend akan diteruskan melalui API Gateway ke service yang sesuai.

---

## 📁 Struktur Proyek

```bash
sharebite/
├── backend/
│
│   ├── auth-service/
│   │   └── Service autentikasi pengguna
│
│   ├── donation-service/
│   │   └── Service manajemen donasi makanan
│
│   ├── delivery-service/
│   │   └── Service pickup dan distribusi
│
│   ├── notification-service/
│   │   └── Service notifikasi dan Socket.IO
│
│   ├── reporting-service/
│   │   └── Service dashboard dan laporan
│
│   ├── gateway/
│   │   └── API Gateway
│
│   ├── data/
│   │   └── Database SQLite
│
│   ├── db.js
│   └── .env
│
├── frontend/
│
├── scripts/
│   └── init-db.js
│
├── start-all.js
├── package.json
└── README.md
```

---

## 🖥️ Halaman Aplikasi

### Landing Page

Menampilkan informasi platform ShareBite dan tombol registrasi/login.

### Login Page

Masuk ke sistem menggunakan akun yang telah terdaftar.

### Register Page

Pendaftaran akun sebagai:

* Pendonor
* Relawan

### Dashboard

Menampilkan:

* Statistik donasi
* Statistik distribusi
* Aktivitas terbaru
* Grafik aktivitas

### Donasi Saya

Pendonor dapat:

* Melihat seluruh donasi
* Menambah donasi
* Edit donasi
* Hapus donasi

### Buat Donasi

Form pembuatan donasi baru dengan upload foto makanan.

### Monitor Pickup

Memantau status pickup dan distribusi makanan.

### Riwayat Distribusi

Menampilkan seluruh riwayat distribusi yang telah selesai.

### Notifikasi

Menampilkan seluruh notifikasi pengguna.

### Profil

* Edit profil
* Ganti password
* Logout akun

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|-----------|-----------|
| Frontend | React.js, Vite, Tailwind CSS |
| UI & Styling | Tailwind CSS, Lucide React |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Data Visualization | Recharts |
| Notification UI | React Hot Toast |
| Date Utility | date-fns |
| Backend | Node.js, Express.js |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Realtime Communication | Socket.IO |
| Database | SQLite via `node:sqlite` (Built-in Node.js) |
| API Architecture | REST API |
| Arsitektur Sistem | Microservices + API Gateway |

---

## ⚙️ Persyaratan
- **Node.js v22.5 atau lebih baru** (Node v24 ✅)
- Windows / macOS / Linux
- **Tidak perlu Visual Studio, tidak perlu install SQLite** — menggunakan `node:sqlite` built-in Node.js

## ⚙️ Persyaratan

Pastikan perangkat Anda telah terinstall:

* Node.js v22.5 atau lebih baru
* npm

Disarankan menggunakan:

```bash
Node.js v24
```

Cek versi Node.js:

```bash
node -v
```

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/sharebite.git

cd sharebite
```

---

### 2. Install Semua Dependency

```bash
npm run install:all
```

Perintah ini akan menginstall:

* Root dependencies
* Backend dependencies
* Frontend dependencies

---

### 3. Inisialisasi Database

```bash
npm run init:db
```

Perintah ini akan:

* Membuat database SQLite
* Membuat tabel-tabel sistem
* Mengisi akun demo

---

### 4. Jalankan Semua Backend Service

```bash
npm start
```

Service yang akan berjalan:

| Service              | Port |
| -------------------- | ---- |
| API Gateway          | 5000 |
| Auth Service         | 5001 |
| Donation Service     | 5002 |
| Delivery Service     | 5003 |
| Notification Service | 5004 |
| Reporting Service    | 5005 |

Biarkan terminal ini tetap berjalan.

---

### 5. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend

npm run dev
```

Frontend akan berjalan pada:

```bash
http://localhost:5173
```

---

## 👤 Akun Demo

### Pendonor

| Email                                                 | Password    |
| ----------------------------------------------------- | ----------- |
| [padang@example.com](mailto:padang@example.com)       | password123 |
| [nusantara@example.com](mailto:nusantara@example.com) | password123 |

### Relawan

| Email                                         | Password    |
| --------------------------------------------- | ----------- |
| [ahmad@example.com](mailto:ahmad@example.com) | password123 |
| [siti@example.com](mailto:siti@example.com)   | password123 |

---

## 🔌 Endpoint Utama

Semua endpoint diakses melalui API Gateway:

```bash
http://localhost:5000
```

Contoh endpoint:

### Authentication

```http
POST /auth/register
POST /auth/login
PUT  /auth/profile
```

### Donations

```http
GET    /donations
POST   /donations
PUT    /donations/:id
DELETE /donations/:id
```

### Delivery

```http
POST /delivery/accept/:id
PUT  /delivery/:id/status
```

### Reports

```http
GET /reports/dashboard
GET /reports/history
```

### Notifications

```http
GET /notifications
PUT /notifications/read
```

---

## 🧪 Pengujian API

Aplikasi dapat diuji menggunakan:

* Postman
* Thunder Client
* Browser

Metode yang tersedia:

* POST (Create)
* GET (Read)
* PUT (Update)
* DELETE (Delete)

Sehingga project ini dapat digunakan untuk kebutuhan pengujian API pada mata kuliah **Kualitas Perangkat Lunak (KPL)**.

---

## 📌 Tujuan Proyek

ShareBite dibuat untuk membantu mengurangi food waste dengan mempertemukan pihak yang memiliki makanan berlebih dengan relawan yang dapat membantu proses distribusi kepada masyarakat yang membutuhkan.

Melalui sistem ini, makanan yang masih layak konsumsi dapat dimanfaatkan dengan lebih efektif, cepat, dan tepat sasaran.

---