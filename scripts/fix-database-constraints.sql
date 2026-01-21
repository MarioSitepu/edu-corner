-- Script untuk memperbaiki constraint NOT NULL pada kolom lama
-- Jalankan script ini di Neon SQL Editor atau melalui psql
-- Script ini akan menghapus constraint NOT NULL dari kolom lama yang tidak lagi digunakan

-- 1. Hapus constraint NOT NULL dari kolom cita_cita (jika ada)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'edu_corner' 
        AND column_name = 'cita_cita'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE edu_corner ALTER COLUMN cita_cita DROP NOT NULL;
        RAISE NOTICE 'Constraint NOT NULL berhasil dihapus dari kolom cita_cita';
    ELSE
        RAISE NOTICE 'Kolom cita_cita tidak memiliki constraint NOT NULL atau tidak ada';
    END IF;
END $$;

-- 2. Hapus constraint NOT NULL dari kolom kelas (jika ada)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'edu_corner' 
        AND column_name = 'kelas'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE edu_corner ALTER COLUMN kelas DROP NOT NULL;
        RAISE NOTICE 'Constraint NOT NULL berhasil dihapus dari kolom kelas';
    ELSE
        RAISE NOTICE 'Kolom kelas tidak memiliki constraint NOT NULL atau tidak ada';
    END IF;
END $$;

-- 3. Tambahkan kolom-kolom baru jika belum ada
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER;
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER;
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255);
ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER;

-- 4. Hapus kolom lama yang tidak lagi digunakan
ALTER TABLE edu_corner DROP COLUMN IF EXISTS cita_cita;
ALTER TABLE edu_corner DROP COLUMN IF EXISTS kelas;

-- 5. Verifikasi struktur tabel
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'edu_corner' 
ORDER BY ordinal_position;
