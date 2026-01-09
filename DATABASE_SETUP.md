# Setup Database Neon untuk Edu-Corner

## Langkah-langkah Setup

### 1. Buat File .env.local

Buat file `.env.local` di root folder `webeducorner` dengan konten berikut:

```
DATABASE_URL=postgresql://neondb_owner:npg_FCYx27AMIpGj@ep-misty-dream-a1vogvfs-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Buat Tabel di Database

Anda memiliki 2 opsi untuk membuat tabel:

#### Opsi A: Menggunakan Neon SQL Editor (Recommended)

1. Login ke [Neon Console](https://console.neon.tech)
2. Pilih project Anda
3. Buka SQL Editor
4. Copy dan paste script berikut:

```sql
CREATE TABLE IF NOT EXISTS edu_corner (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  cita_cita TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC);
```

5. Klik "Run" untuk menjalankan script

#### Opsi B: Menggunakan psql Command Line

Jalankan perintah berikut di terminal:

```bash
psql 'postgresql://neondb_owner:npg_FCYx27AMIpGj@ep-misty-dream-a1vogvfs-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f scripts/create-table.sql
```

### 3. Jalankan Aplikasi

Setelah tabel dibuat, jalankan aplikasi:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Tabel

Tabel `edu_corner` memiliki struktur berikut:

- `id` (SERIAL PRIMARY KEY) - ID unik untuk setiap record
- `nama` (VARCHAR(255)) - Nama pengguna
- `cita_cita` (TEXT) - Cita-cita pengguna
- `created_at` (TIMESTAMP) - Waktu data dibuat (otomatis)

## API Endpoints

### GET /api/data
Mengambil semua data dari database

### POST /api/data
Menyimpan data baru ke database
Body: `{ "nama": "string", "citaCita": "string" }`

### DELETE /api/data/[id]
Menghapus data berdasarkan ID

