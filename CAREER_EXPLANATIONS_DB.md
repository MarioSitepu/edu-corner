# Database Penjelasan Pekerjaan

## Struktur Tabel

Tabel `career_explanations` digunakan untuk menyimpan penjelasan lengkap tentang berbagai profesi/cita-cita.

### Schema Tabel

```sql
CREATE TABLE IF NOT EXISTS career_explanations (
  id SERIAL PRIMARY KEY,
  cita_cita VARCHAR(255) NOT NULL UNIQUE,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Kolom

- `id` (SERIAL PRIMARY KEY) - ID unik untuk setiap record
- `cita_cita` (VARCHAR(255)) - Nama profesi/cita-cita (UNIQUE)
- `explanation` (TEXT) - Penjelasan lengkap tentang profesi
- `created_at` (TIMESTAMP) - Waktu data dibuat (otomatis)
- `updated_at` (TIMESTAMP) - Waktu data terakhir diupdate (otomatis)

### Index

- `idx_career_explanations_cita_cita` - Index untuk pencarian cepat berdasarkan cita-cita (case-insensitive)

### Trigger

- `update_career_explanations_updated_at` - Trigger untuk mengupdate `updated_at` otomatis saat data diupdate

## API Endpoints

### GET /api/career-explanations

Mengambil semua penjelasan pekerjaan atau berdasarkan cita-cita.

**Query Parameters:**
- `citaCita` (optional) - Filter berdasarkan cita-cita

**Contoh:**
```bash
# Ambil semua penjelasan
GET /api/career-explanations

# Ambil penjelasan untuk "Dokter"
GET /api/career-explanations?citaCita=Dokter
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "cita_cita": "Dokter",
      "explanation": "Menjadi dokter adalah profesi yang sangat mulia...",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/career-explanations

Menyimpan atau mengupdate penjelasan pekerjaan.

**Body:**
```json
{
  "citaCita": "Dokter",
  "explanation": "Penjelasan lengkap tentang profesi dokter..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cita_cita": "Dokter",
    "explanation": "Penjelasan lengkap tentang profesi dokter...",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** Jika cita-cita sudah ada, akan diupdate. Jika belum ada, akan diinsert.

### GET /api/career-explanations/[id]

Mengambil penjelasan berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "cita_cita": "Dokter",
    "explanation": "Penjelasan lengkap...",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/career-explanations/[id]

Mengupdate penjelasan berdasarkan ID.

**Body:**
```json
{
  "citaCita": "Dokter",
  "explanation": "Penjelasan yang diupdate..."
}
```

### DELETE /api/career-explanations/[id]

Menghapus penjelasan berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "message": "Data berhasil dihapus"
}
```

## Integrasi dengan API Explain Career

API `/api/explain-career` sekarang terintegrasi dengan database:

1. **Cek Database Terlebih Dahulu**: Sebelum memanggil Groq API, sistem akan mengecek apakah sudah ada penjelasan di database
2. **Gunakan dari Database**: Jika ada, langsung menggunakan penjelasan dari database (lebih cepat)
3. **Simpan ke Database**: Setelah mendapatkan penjelasan dari Groq atau fallback, sistem akan menyimpannya ke database untuk penggunaan selanjutnya

## Validasi Input

- `citaCita`: Maksimal 255 karakter, wajib diisi
- `explanation`: Maksimal 5000 karakter, wajib diisi
- Input akan di-sanitize untuk mencegah XSS

## Auto-Creation

Tabel akan dibuat otomatis saat pertama kali API dipanggil jika belum ada. Tidak perlu setup manual.

## Manfaat

1. **Performa Lebih Baik**: Penjelasan dari database lebih cepat daripada memanggil Groq API setiap kali
2. **Konsistensi**: Penjelasan yang sama akan selalu sama untuk setiap cita-cita
3. **Penghematan**: Mengurangi penggunaan quota Groq API
4. **Kustomisasi**: Admin bisa mengedit penjelasan langsung di database jika diperlukan
