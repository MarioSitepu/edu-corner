# EduCorner: SahabatMimpi

> Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis kepribadian berbasis MBTI dan rekomendasi profesi yang sesuai.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/MarioSitepu/edu-corner)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://edu-corner-seven.vercel.app)
[![EduCorner](https://img.shields.io/badge/EduCorner-SahabatMimpi-pink?style=for-the-badge)](https://github.com/MarioSitepu/edu-corner)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Testing](#testing)
- [Kontribusi](#kontribusi)
- [Troubleshooting](#troubleshooting)
- [Tim](#development-team)
- [Lisensi](#lisensi)

## 🎯 Tentang Proyek

EduCorner: SahabatMimpi adalah platform edukasi interaktif yang dirancang untuk membantu siswa SD, SMP, dan SMA di Indonesia menemukan potensi diri dan mengembangkan cita-cita mereka. Platform ini menggunakan sistem kuis kepribadian berbasis MBTI (Myers-Briggs Type Indicator) yang disesuaikan untuk anak-anak dan remaja.

### 🌟 Tujuan Proyek

- 🎯 Membantu siswa mengenali kepribadian dan minat mereka
- 💼 Memberikan rekomendasi profesi yang sesuai dengan kepribadian
- 📊 Menyediakan dashboard untuk melihat hasil kuis
- 📚 Memberikan informasi lengkap tentang berbagai profesi
- 🤖 Menggunakan AI untuk penjelasan profesi yang lebih detail
- 📄 Export hasil kuis dalam format PDF yang profesional

## ✨ Fitur Utama

### 1. **Kuis Kepribadian MBTI**
- 32 soal interaktif yang disesuaikan untuk siswa
- Sistem scoring otomatis untuk menentukan tipe kepribadian MBTI
- Progress bar dan animasi yang menarik
- Auto-save progress (bisa dilanjutkan kapan saja)

### 2. **Rekomendasi Profesi**
- 12 profesi berbeda dengan deskripsi lengkap
- Top 3 rekomendasi berdasarkan kecocokan kepribadian
- Informasi tentang tokoh inspiratif untuk setiap profesi
- Mata pelajaran yang relevan untuk setiap profesi

### 3. **Dashboard Admin**
- Login sistem dengan autentikasi JWT
- Tampilan semua hasil kuis siswa
- Fitur pencarian dan sorting
- Download hasil kuis dalam format PDF
- Manajemen data (hapus, lihat detail)

### 4. **Export PDF**
- Generate PDF hasil kuis secara otomatis
- Format yang rapi dan profesional
- Informasi lengkap tentang rekomendasi profesi

### 5. **Penjelasan Profesi AI**
- Integrasi dengan Groq AI untuk penjelasan profesi yang lebih detail
- Penjelasan yang mudah dipahami untuk siswa

### 6. **SEO Optimized**
- Structured data (JSON-LD)
- Meta tags lengkap
- Sitemap dan robots.txt
- Open Graph dan Twitter Cards

### 7. **Responsive Design**
- Mobile-first approach
- Tampilan yang optimal di semua perangkat
- UI/UX yang menarik dan user-friendly

### 8. **Forgot Password**
- Firebase Email Link passwordless authentication
- Secure password reset tanpa OTP
- Magic link dikirim langsung ke email
- Link valid selama 1 jam

### 9. **Sound Effects**
- Sound effects untuk interaksi pengguna
- Opsi untuk mengaktifkan/menonaktifkan suara
- Pengalaman yang lebih interaktif dan engaging

## 🛠 Teknologi yang Digunakan

### Frontend
- **Next.js 16.1.1** - React framework dengan App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **jsPDF** - PDF generation
- **html2canvas** - Screenshot untuk PDF

### Backend
- **Next.js API Routes** - Serverless API
- **Neon PostgreSQL** - Database serverless
- **Firebase Auth** - Email Link passwordless authentication
- **JWT (jose)** - Session management
- **Groq SDK** - AI untuk penjelasan profesi

### Database
- **PostgreSQL** (via Neon)
- Struktur tabel: `edu_corner` dengan kolom lengkap

### Deployment
- **Vercel** (recommended)
- Support untuk platform serverless lainnya

## 📦 Persyaratan Sistem

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 atau **yarn** >= 1.22.0
- **PostgreSQL** database (Neon recommended)
- **Git** untuk version control

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/MarioSitepu/edu-corner.git
cd edu-corner
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder `Edu-Corner`:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Groq AI (untuk penjelasan profesi)
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration (untuk authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Configuration
ADMIN_EMAIL=your-admin-email@gmail.com
ADMIN_USERNAME=admin

# JWT Secret (untuk session management)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Site Verification (opsional)
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code
BING_VERIFICATION=your_bing_verification_code
FACEBOOK_DOMAIN_VERIFICATION=your_facebook_verification_code
```

### 4. Setup Database

#### Opsi A: Menggunakan Neon SQL Editor (Recommended)

1. Login ke [Neon Console](https://console.neon.tech)
2. Pilih project Anda
3. Buka SQL Editor
4. Copy dan paste script berikut:

```sql
CREATE TABLE IF NOT EXISTS edu_corner (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  karakter VARCHAR(20),
  mbti_code VARCHAR(10),
  posisi_1_nama VARCHAR(255),
  posisi_1_persentase INTEGER,
  posisi_2_nama VARCHAR(255),
  posisi_2_persentase INTEGER,
  posisi_3_nama VARCHAR(255),
  posisi_3_persentase INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC);
```

5. Klik "Run" untuk menjalankan script

#### Opsi B: Menggunakan Script SQL

Jalankan script di `scripts/create-table.sql` menggunakan psql atau Neon SQL Editor.

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## ⚙️ Konfigurasi

### Database Configuration

Pastikan `DATABASE_URL` di `.env.local` sudah benar. Format:
```
postgresql://username:password@host/database?sslmode=require
```

### Firebase Authentication

Untuk fitur forgot password (Email Link), Anda perlu:
1. Buat Firebase project di [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password provider di Authentication
3. Enable **Email link (passwordless sign-in)**
4. Dapatkan Firebase config dan set semua `NEXT_PUBLIC_FIREBASE_*` di `.env.local`
5. Set `ADMIN_EMAIL` (email admin yang bisa reset password)

**Setup Guide lengkap**: Lihat `firebase_setup_guide.md` di folder artifacts

### JWT Secret

Gunakan string acak yang kuat untuk `JWT_SECRET` di production. Contoh:
```bash
openssl rand -base64 32
```

### Groq AI

Untuk fitur penjelasan profesi AI:
1. Daftar di [Groq](https://groq.com)
2. Dapatkan API key
3. Set `GROQ_API_KEY` di `.env.local`

## 📖 Penggunaan

### Untuk Siswa

1. **Mulai Kuis**
   - Buka halaman utama
   - Klik "Mulai Kuis"
   - Pilih karakter dan masukkan nama
   - Jawab 32 pertanyaan
   - Lihat hasil rekomendasi profesi

2. **Download Hasil**
   - Setelah selesai kuis, klik "Unduh PDF"
   - File PDF akan otomatis terdownload

### Untuk Admin

1. **Login**
   - Buka `/cekhasil/login`
   - Masukkan username dan password
   - Akses dashboard admin

2. **Dashboard**
   - Lihat semua hasil kuis siswa
   - Gunakan fitur search untuk mencari data
   - Sort berdasarkan kolom tertentu
   - Download PDF hasil kuis
   - Hapus data jika diperlukan

## 📁 Struktur Proyek

```
webeducorner/
├── public/                 # Static files
│   ├── quiz/              # Gambar soal kuis
│   ├── logo.svg           # Logo aplikasi
│   └── robots.txt         # Robots.txt untuk SEO
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   ├── admin/     # Admin endpoints
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── data/      # Data CRUD endpoints
│   │   │   └── explain-career/  # AI explanation endpoint
│   │   ├── cekhasil/      # Admin dashboard pages
│   │   ├── history/       # History page
│   │   ├── kuis/          # Quiz page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Homepage
│   │   ├── sitemap.ts     # Dynamic sitemap
│   │   └── manifest.ts    # PWA manifest
│   ├── components/         # React components
│   │   └── StructuredData.tsx  # SEO structured data
│   ├── lib/               # Utility libraries
│   │   ├── db.ts          # Database connection
│   │   ├── email.ts       # Email utilities
│   │   └── pdf-generator.ts  # PDF generation utilities
│   └── types/             # TypeScript types
├── scripts/               # Database scripts
│   ├── create-table.sql   # Create table script
│   └── setup-database.js  # Database setup script
├── .env.local            # Environment variables (not committed)
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔌 API Endpoints

### Public Endpoints

#### `GET /api/data`
Mengambil semua data hasil kuis.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "John Doe",
      "karakter": "Berani",
      "mbti_code": "ENFP",
      "posisi_1_nama": "Dokter & Tenaga Medis",
      "posisi_1_persentase": 75,
      "created_at": "2026-01-18T10:00:00Z"
    }
  ]
}
```

#### `POST /api/data`
Menyimpan hasil kuis baru.

**Request Body:**
```json
{
  "nama": "John Doe",
  "karakter": "Berani",
  "mbtiCode": "ENFP",
  "topCareers": [
    {
      "position": 1,
      "name": "Dokter & Tenaga Medis",
      "matchPercent": 75,
      "score": 3
    }
  ]
}
```

#### `DELETE /api/data/[id]`
Menghapus data berdasarkan ID (requires authentication).

### Admin Endpoints (Requires Authentication)

#### `GET /api/admin/all-data`
Mengambil semua data untuk admin dashboard.

#### `POST /api/auth/login`
Login admin.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

#### `POST /api/auth/logout`
Logout admin.

#### `GET /api/auth/verify`
Verifikasi token JWT.

### Other Endpoints

#### `POST /api/explain-career`
Mendapatkan penjelasan profesi dari AI.

**Request Body:**
```json
{
  "citaCita": "Dokter & Tenaga Medis"
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy ke Vercel**
   - Login ke [Vercel](https://vercel.com)
   - Import project dari GitHub
   - Set environment variables di Vercel dashboard
   - Deploy

3. **Environment Variables di Vercel**
   - Masukkan semua variabel dari `.env.local`
   - Pastikan `NEXT_PUBLIC_BASE_URL` menggunakan domain production

### Environment Variables untuk Production

```env
DATABASE_URL=your_production_database_url
GROQ_API_KEY=your_production_groq_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
ADMIN_EMAIL=your-admin-email@gmail.com
ADMIN_USERNAME=admin
JWT_SECRET=your-production-jwt-secret
```

### Setup Firebase Authorized Domains (Production)

Untuk domain production:
1. Login ke Firebase Console
2. Buka **Authentication** → **Settings**
3. Scroll ke **Authorized domains**
4. Add domain production: `educorner.my.id`
5. Klik **Add**

## 🧪 Testing

### Manual Testing Checklist

- [ ] Kuis dapat diselesaikan dari awal sampai akhir
- [ ] Progress tersimpan dan bisa dilanjutkan
- [ ] Hasil kuis muncul dengan benar
- [ ] PDF dapat di-download
- [ ] Admin dapat login
- [ ] Admin dapat melihat semua data
- [ ] Admin dapat menghapus data
- [ ] Search dan sort berfungsi
- [ ] Responsive di mobile dan desktop

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk kontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

### Guidelines

- Ikuti code style yang sudah ada
- Tambahkan komentar untuk kode yang kompleks
- Update dokumentasi jika diperlukan
- Test perubahan Anda sebelum commit

## 🐛 Troubleshooting

### Database Connection Error

**Problem:** `DATABASE_URL tidak ditemukan`

**Solution:**
- Pastikan file `.env.local` ada di root folder `webeducorner`
- Pastikan `DATABASE_URL` sudah di-set dengan benar
- Restart development server setelah mengubah `.env.local`

### Email Link Tidak Terkirim

**Problem:** Email reset password tidak terkirim

**Solution:**
- Cek Firebase Email Link sudah enabled di Firebase Console
- Pastikan semua `NEXT_PUBLIC_FIREBASE_*` environment variables sudah benar
- Cek quota Firebase (free plan memiliki daily limit)
- Periksa folder Spam/Junk di email

### PDF Generation Error

**Problem:** Error saat generate PDF

**Solution:**
- Pastikan browser support JavaScript
- Cek console untuk error detail
- Pastikan semua data sudah lengkap sebelum generate PDF

## 👥 Development Team

Proyek ini dikembangkan oleh tim **KKN T31 Margo Lestari**:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MarioSitepu">
        <b>Mario Fransiskus Sitepu</b><br/>
        <sub>Project Manager & Backend Developer</sub>
      </a>
    </td>
    <td align="center">
      <b>Elfa Noviana Sari</b><br/>
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <b>George Haansraj</b><br/>
      <sub>Web Logic & Content Creator</sub>
    </td>
  </tr>
</table>

### Peran & Kontribusi

**Mario Fransiskus Sitepu** - Project Manager & Backend Developer
- 📋 Mengelola proyek dan koordinasi tim
- 🔧 Mengembangkan backend API dan serverless architecture
- 🗄️ Database design dan optimasi
- 🔐 Sistem autentikasi dan keamanan

**Elfa Noviana Sari** - Frontend Developer
- 🎨 UI/UX design dan implementasi
- ⚛️ React components dan user interface
- 📱 Responsive design dan mobile optimization
- 🎭 Animasi dan interaksi pengguna

**George Haansraj** - Web Logic & Content Creator
- 🧠 Business logic dan algoritma kuis MBTI
- 📝 Content creation dan konten edukatif
- 🎯 Algoritma matching profesi dengan kepribadian
- 📚 Penelitian dan pengembangan konten profesi

## 🙏 Acknowledgments

Terima kasih kepada:

- **Next.js** team untuk framework yang luar biasa
- **Neon** untuk database serverless yang handal
- **Firebase** untuk authentication service yang mudah dan aman
- **Groq** untuk AI service yang powerful
- **Vercel** untuk platform deployment yang seamless
- Semua kontributor dan pengguna platform ini

## 📞 Support & Contact

Jika ada pertanyaan, saran, atau masalah:

- 📧 **Buka Issue** di [GitHub Issues](https://github.com/MarioSitepu/edu-corner/issues)
- 🌐 **Live Demo**: [edu-corner-seven.vercel.app](https://edu-corner-seven.vercel.app)
- 📖 **Repository**: [github.com/MarioSitepu/edu-corner](https://github.com/MarioSitepu/edu-corner)

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

Copyright (c) 2026 KKN T31 Margo Lestari

---

<div align="center">

**Made with ❤️ by KKN T31 Margo Lestari**

[⬆ Back to Top](#educorner-sahabatmimpi)

</div>
