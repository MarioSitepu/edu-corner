-- Script migrasi untuk memperbarui struktur tabel edu_corner
-- Menghapus kolom lama (cita_cita, kelas) dan menambahkan kolom baru (mbti_code, posisi_1-3)
-- Jalankan script ini di Neon SQL Editor atau melalui psql

-- 1. Hapus constraint NOT NULL dari kolom lama (jika ada)
-- Ini penting karena kolom lama mungkin masih memiliki constraint NOT NULL
ALTER TABLE edu_corner ALTER COLUMN cita_cita DROP NOT NULL;
ALTER TABLE edu_corner ALTER COLUMN kelas DROP NOT NULL;

-- 2. Tambahkan kolom-kolom baru jika belum ada
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER;
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER;
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER;

-- 2. (Opsional) Migrasi data lama jika ada kolom cita_cita
-- Jika ada data lama dengan kolom cita_cita, bisa dipindahkan ke posisi_1_nama
-- Uncomment baris di bawah jika ingin migrasi data lama:
-- UPDATE edu_corner 
-- SET posisi_1_nama = cita_cita 
-- WHERE posisi_1_nama IS NULL AND cita_cita IS NOT NULL;

-- 3. Hapus kolom lama yang tidak lagi digunakan
-- Kolom cita_cita dan kelas sudah tidak digunakan lagi
ALTER TABLE edu_corner DROP COLUMN IF EXISTS cita_cita;
ALTER TABLE edu_corner DROP COLUMN IF EXISTS kelas;

-- 4. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edu_corner_mbti_code ON edu_corner(mbti_code);

-- 5. Verifikasi struktur tabel
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'edu_corner' 
ORDER BY ordinal_position;
