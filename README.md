# UNIKA.IN — Frontend

Frontend aplikasi **UNIKA.IN**, sistem manajemen dan konversi SKS MBKM (Magang & Studi Independen) untuk **Fakultas Ilmu Komputer, Universitas AMIKOM Yogyakarta**. Dibangun sebagai proyek Hackathon oleh tim **Punakawan**.

Aplikasi ini menjadi jembatan digital antara **Mahasiswa**, **Dosen Pembimbing Lapangan (DPL)**, **Mitra Industri**, dan **Admin Program Studi (Kaprodi/Dekan)** dalam mengelola seluruh alur pengajuan magang, penilaian, hingga konversi SKS.

## ✨ Fitur Utama

Sistem memiliki 4 role dengan dashboard masing-masing:

| Role | Deskripsi Akses |
| :--- | :--- |
| 🎓 **Mahasiswa** | Pengajuan 5 Step MBKM (Pengajuan FIK, Proposal Magang, Surat Pengantar, Plotting DPL, Konversi SKS), pengisian logbook, form konversi SKS, pengajuan surat akhir/ucapan terima kasih |
| 👨‍🏫 **Dosen Pembimbing Lapangan (DPL)** | Melihat mahasiswa bimbingan, review & ACC/revisi klaim nilai konversi SKS, input nilai & catatan evaluasi, export data ke Excel |
| 🏢 **Mitra Industri** | Melihat daftar mahasiswa magang, verifikasi logbook, input penilaian akhir magang (nilai & huruf), catatan evaluasi, serta lampiran sertifikat magang |
| 👑 **Admin Kaprodi / Dekan** | Dashboard analitik eksekutif, tracking progres 5 Step seluruh mahasiswa, kelola akun DPL & Mitra, kelola master data Mata Kuliah/CPMK/CPL |

Fitur pendukung lainnya:
- Autentikasi berbasis JWT dengan login fleksibel (NIM / NIDN / Email)
- Generate dokumen PDF (surat pengantar, surat akhir, dsb.) menggunakan `jspdf` & `html2canvas`
- Export data ke Excel menggunakan `xlsx`
- Rekomendasi konversi SKS berbasis AI (integrasi ke backend)

## 🛠️ Tech Stack

- **React 19** + **Vite 8** — library UI & build tool
- **React Router DOM 7** — routing & proteksi rute berbasis role
- **Context API** — manajemen state autentikasi (`AuthContext`)
- **Lucide React** — icon set
- **jsPDF & html2canvas** — generate dokumen PDF
- **SheetJS (xlsx)** — export data ke Excel
- **ESLint** — linting kode

## 📁 Struktur Folder

```
src/
├── assets/            # Aset statis (gambar, dll)
├── components/        # Komponen reusable (Card, Input, InternshipWizard, dll)
├── context/           # AuthContext untuk manajemen sesi & role pengguna
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── dashboard/
│       ├── DosenDashboard.jsx
│       ├── KaprodiDashboard.jsx
│       ├── MitraDashboard.jsx
│       ├── dosen/
│       └── mahasiswa/         # Pengajuan magang, proposal, surat pengantar, dll
├── services/          # Layer pemanggilan API (auth, dosen, mitra, admin, dll)
├── utils/             # Utility (pdfGenerator, dll)
├── App.jsx            # Routing utama & proteksi rute
└── main.jsx           # Entry point aplikasi
```

Dokumentasi teknis tambahan (userflow, sequence diagram, API spec per modul) tersedia di root repo:
- `AUTHENTICATION_WORKFLOW.md`
- `DASHBOARD_ADMIN_WORKFLOW.md`
- `DASHBOARD_DOSEN_WORKFLOW.md`
- `DASHBOARD_MAHASISWA_WORKFLOW.md`
- `DASHBOARD_MITRA_WORKFLOW.md`

## 🚀 Instalasi & Menjalankan Proyek

### Prasyarat
- Node.js versi 18 ke atas
- npm

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/Hackathon-4-Punakawan/Front-End.git
   cd Front-End
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variable**

   Salin `.env.example` menjadi `.env`, lalu sesuaikan nilainya:
   ```bash
   cp .env.example .env
   ```
   Isi `.env`:
   ```
   VITE_API_BASE_URL=https://backend-konversi.vercel.app/api/v1
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173` (default port Vite).

5. **Build untuk production**
   ```bash
   npm run build
   ```

6. **Preview hasil build**
   ```bash
   npm run preview
   ```

7. **Lint kode**
   ```bash
   npm run lint
   ```

## 🌐 Deployment

Proyek ini dikonfigurasi untuk deploy di **Vercel** (lihat `vercel.json`) dengan rewrite semua rute ke `index.html`, sesuai kebutuhan SPA (Single Page Application) berbasis React Router.

## 🔐 Role & Autentikasi

Sistem menggunakan JWT Bearer Token. Setelah login, pengguna diarahkan ke dashboard sesuai role masing-masing:
- `/dashboard/mahasiswa`
- `/dashboard/dosen`
- `/dashboard/mitra`
- `/dashboard/kaprodi`

Setiap rute dashboard dilindungi oleh `ProtectedRoute` yang memverifikasi status login dan kesesuaian role pengguna.

## 👥 Tim

Dikembangkan oleh **Tim Punakawan** — Fakultas Ilmu Komputer, Universitas AMIKOM Yogyakarta.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan hackathon dan akademik.
