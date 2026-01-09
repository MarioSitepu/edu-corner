-- Script untuk menambahkan kolom kelas ke tabel edu_corner
-- Jalankan script ini di Neon SQL Editor atau melalui psql

-- Tambahkan kolom kelas jika belum ada
ALTER TABLE edu_corner 
ADD COLUMN IF NOT EXISTS kelas VARCHAR(10);

-- Update index jika diperlukan
CREATE INDEX IF NOT EXISTS idx_edu_corner_kelas ON edu_corner(kelas);
