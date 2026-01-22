# EduCorner: SahabatMimpi

Platform interaktif untuk membantu siswa menemukan dan mengembangkan cita-cita mereka melalui kuis kepribadian berbasis MBTI dan rekomendasi profesi yang sesuai.

![EduCorner](https://img.shields.io/badge/EduCorner-SahabatMimpi-pink?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)

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
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🎯 Tentang Proyek

EduCorner: SahabatMimpi adalah platform edukasi interaktif yang dirancang untuk membantu siswa SD, SMP, dan SMA di Indonesia menemukan potensi diri dan mengembangkan cita-cita mereka. Platform ini menggunakan sistem kuis kepribadian berbasis MBTI (Myers-Briggs Type Indicator) yang disesuaikan untuk anak-anak dan remaja.

### Tujuan Proyek

- Membantu siswa mengenali kepribadian dan minat mereka
- Memberikan rekomendasi profesi yang sesuai dengan kepribadian
- Menyediakan dashboard untuk melihat hasil kuis
- Memberikan informasi lengkap tentang berbagai profesi

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
- **JWT (jose)** - Autentikasi
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
git clone <repository-url>
cd webeducorner
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder `webeducorner`:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Base URL (untuk SEO dan links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Configuration (untuk forgot password)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your-admin-email@gmail.com

# JWT Secret (untuk autentikasi)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Groq AI (untuk penjelasan profesi)
GROQ_API_KEY=your_groq_api_key_here

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

### Email Configuration

Untuk fitur forgot password, Anda perlu:
1. Daftar di [Resend](https://resend.com)
2. Dapatkan API key
3. Set `RESEND_API_KEY` di `.env.local`
4. Set `EMAIL_FROM` (gunakan `onboarding@resend.dev` untuk testing)
5. Set `ADMIN_EMAIL` (email yang akan menerima OTP)

Lihat `EMAIL_CONFIGURATION.md` untuk detail lengkap.

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
NEXT_PUBLIC_BASE_URL=https://educorner.my.id
RESEND_API_KEY=your_production_resend_key
EMAIL_FROM=noreply@educorner.my.id
ADMIN_EMAIL=your-admin-email@gmail.com
JWT_SECRET=your-production-jwt-secret
GROQ_API_KEY=your_production_groq_key
```

### Setup Domain di Resend (Production)

Untuk menggunakan custom email domain:
1. Login ke Resend Dashboard
2. Buka menu "Domains"
3. Add domain: `educorner.my.id`
4. Setup DNS records (SPF, DKIM, DMARC)
5. Set `EMAIL_FROM=noreply@educorner.my.id`

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

## 📝 Dokumentasi Tambahan

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Panduan setup database
- [ADMIN_DATABASE_TROUBLESHOOTING.md](./ADMIN_DATABASE_TROUBLESHOOTING.md) - Admin tidak menampilkan database yang sesuai
- [EMAIL_CONFIGURATION.md](./EMAIL_CONFIGURATION.md) - Konfigurasi email
- [EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md) - Troubleshooting email
- [FORGOT_PASSWORD_SETUP.md](./FORGOT_PASSWORD_SETUP.md) - Setup forgot password
- [SEO_GUIDE.md](./SEO_GUIDE.md) - Panduan SEO
- [CAREER_EXPLANATIONS_DB.md](./CAREER_EXPLANATIONS_DB.md) - Database penjelasan profesi

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

### Email Tidak Terkirim

**Problem:** Email OTP tidak terkirim

**Solution:**
- Cek `RESEND_API_KEY` sudah benar
- Pastikan `EMAIL_FROM` menggunakan domain Resend (`onboarding@resend.dev` untuk testing)
- Lihat `EMAIL_TROUBLESHOOTING.md` untuk detail

### PDF Generation Error

**Problem:** Error saat generate PDF

**Solution:**
- Pastikan browser support JavaScript
- Cek console untuk error detail
- Pastikan semua data sudah lengkap sebelum generate PDF

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

Copyright (c) 2026 KKN T31 Margo Lestari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👥 Tim

- **KKN T31 Margo Lestari** - Development Team

## 🙏 Acknowledgments

- Next.js team untuk framework yang luar biasa
- Neon untuk database serverless
- Resend untuk email service
- Groq untuk AI service
- Semua kontributor dan pengguna platform ini

## 📞 Support

Jika ada pertanyaan atau masalah, silakan:
- Buka issue di GitHub
- Hubungi tim development
- Lihat dokumentasi di folder `docs/`

---

**Made with ❤️ by KKN T31 Margo Lestari**
