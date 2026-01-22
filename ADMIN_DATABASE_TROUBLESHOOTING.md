# Admin Tidak Menampilkan Database yang Sesuai – Troubleshooting

Panduan ini membantu jika **halaman admin (Cek Hasil)** yang sudah di-deploy **tidak menampilkan data** atau **menampilkan data yang salah**.

---

## 1. Pastikan `DATABASE_URL` di Production Benar

Admin dan kuis memakai **database yang sama** lewat `process.env.DATABASE_URL`. Kalau nilai ini salah, admin akan mengakses database yang berbeda.

### Cek di Vercel

1. Buka [Vercel Dashboard](https://vercel.com) → pilih **Project** EduCorner
2. **Settings** → **Environment Variables**
3. Pastikan **`DATABASE_URL`** ada dan diisi untuk **Production** (dan **Preview** jika admin dipakai di preview).
4. Nilai harus **Connection String Neon** yang dipakai untuk **production**, contoh:
   ```
   postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

### Sumber data yang salah

- **Lokal:** `.env.local` (hanya untuk development)
- **Production:** **Environment Variables di Vercel** (bukan file .env di repo)

Jika `DATABASE_URL` di Vercel:

- **Tidak di-set** → koneksi DB gagal, admin bisa error atau kosong.
- **Mengarah ke DB development / project Neon lain** → admin menampilkan data dari DB itu, **bukan** dari DB tempat hasil kuis production disimpan.

**Solusi:** Set `DATABASE_URL` di Vercel ke **Connection String Neon project production** yang dipakai untuk menyimpan hasil kuis.  
Ambil dari: [Neon Console](https://console.neon.tech) → pilih project → **Connection Details** → **Pooled connection**.

---

## 2. Pastikan Satu Database untuk Kuis dan Admin

- **Kuis** menyimpan lewat: `POST /api/data` → pakai `DATABASE_URL`.
- **Admin** mengambil lewat: `GET /api/admin/all-data` → pakai `DATABASE_URL` yang sama.

Keduanya dalam **satu deploy** (satu `DATABASE_URL`). Jadi:

- Kalau kuis production sudah nyimpan data, admin **harus** pakai `DATABASE_URL` yang **sama** dengan saat kuis menyimpan.
- Kalau ada **dua project Neon** (mis. satu untuk dev, satu untuk prod), pastikan Vercel **Production** memakai **project production**.

---

## 3. Pastikan Struktur Tabel `edu_corner` Sudah Di-migrate

Aplikasi butuh kolom: `id`, `nama`, `karakter`, `mbti_code`, `posisi_1_nama`, `posisi_1_persentase`, `posisi_2_nama`, `posisi_2_persentase`, `posisi_3_nama`, `posisi_3_persentase`, `created_at`.

Jika DB production masih pakai **skema lama** (`cita_cita`, `kelas` saja, tanpa kolom di atas), query admin bisa gagal dan data tampil kosong.

### Opsi A: Panggil API yang melakukan migrasi (disarankan)

- **GET** atau **POST** ke `/api/data` (dengan aplikasi production) **sekali**.  
- Route `/api/data` akan menambah kolom yang kurang dan menyesuaikan tabel. Setelah itu, admin bisa baca data dengan benar.

### Opsi B: Migrasi manual di Neon

1. Buka [Neon Console](https://console.neon.tech) → pilih **project production**
2. **SQL Editor** → jalankan isi:  
   `webeducorner/scripts/migrate-to-new-structure.sql`
3. Setelah berhasil, coba buka admin lagi.

---

## 4. Cek Environment (Production vs Preview)

Di Vercel:

- **Production** → dipakai untuk domain utama (mis. `educorner.my.id`).
- **Preview** → deploy dari branch/PR.

`DATABASE_URL` bisa di-set **hanya untuk Production**. Kalau admin diakses lewat **link Preview**, env bisa kosong atau beda, sehingga koneksi ke DB production gagal atau salah.

**Solusi:** Di Vercel → Environment Variables → pastikan `DATABASE_URL` juga diisi untuk **Preview** jika admin dipakai di deploy preview.

---

## 5. Cek Tabel dan Data di Neon

1. Buka [Neon Console](https://console.neon.tech) → pilih **project yang dipakai di `DATABASE_URL` production**
2. **SQL Editor**:
   - Cek apakah tabel ada:
     ```sql
     SELECT COUNT(*) FROM edu_corner;
     ```
   - Cek struktur:
     ```sql
     SELECT column_name, data_type 
     FROM information_schema.columns 
     WHERE table_name = 'edu_corner' 
     ORDER BY ordinal_position;
     ```
3. Pastikan:
   - Tabel `edu_corner` ada
   - Ada kolom: `nama`, `karakter`, `mbti_code`, `posisi_1_nama`, `posisi_1_persentase`, dll (atau minimal `id`, `nama`, `created_at` jika masih transisi)
   - Ada baris data jika kuis production sudah dipakai

---

## 6. Ringkasan Cek Cepat

| Cek | Di mana | Yang dicek |
|-----|---------|------------|
| `DATABASE_URL` production | Vercel → Project → Settings → Environment Variables | Harus ada, isi = Connection String Neon **production** |
| DB yang dipakai kuis | Sama dengan `DATABASE_URL` | Harus **satu** DB untuk kuis dan admin |
| Struktur `edu_corner` | Neon SQL Editor / `migrate-to-new-structure.sql` | Kolom `karakter`, `mbti_code`, `posisi_1_nama`, dll. |
| Data di DB | Neon SQL: `SELECT * FROM edu_corner LIMIT 5` | Ada baris jika kuis sudah dipakai |

---

## 7. Jika Masih Bermasalah

- **Vercel → Project → Deployments** → pilih deployment terakhir → **Functions** / **Logs**: cari error dari `/api/admin/all-data` atau `DATABASE_URL`.
- **Browser** → buka halaman admin → **DevTools (F12)** → **Network**: cek respons ` /api/admin/all-data` (status 401/500, isi `error`).
- Pastikan **JWT / login admin** sudah benar; jika `401 Unauthorized`, admin tidak akan dapat data.

---

## 8. Referensi

- `DATABASE_URL`: `src/lib/db.ts`
- Admin API: `src/app/api/admin/all-data/route.ts`
- Halaman admin: `src/app/cekhasil/page.tsx`
- Simpan hasil kuis: `src/app/api/data/route.ts` (POST)
- Migrasi: `scripts/migrate-to-new-structure.sql`, `DATABASE_SETUP.md`
