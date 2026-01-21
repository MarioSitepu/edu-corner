-- Script untuk menghapus kolom lama dari tabel edu_corner
-- PERHATIAN: Pastikan data penting sudah di-backup sebelum menjalankan script ini!
-- Jalankan script ini di Neon SQL Editor atau melalui psql

-- 1. Hapus constraint NOT NULL dari kolom lama (jika ada)
ALTER TABLE edu_corner ALTER COLUMN cita_cita DROP NOT NULL;
ALTER TABLE edu_corner ALTER COLUMN kelas DROP NOT NULL;

-- 2. Hapus kolom lama dari tabel edu_corner
ALTER TABLE edu_corner DROP COLUMN IF EXISTS cita_cita;
ALTER TABLE edu_corner DROP COLUMN IF EXISTS kelas;

-- 3. Verifikasi struktur tabel setelah penghapusan
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'edu_corner' 
ORDER BY ordinal_position;
