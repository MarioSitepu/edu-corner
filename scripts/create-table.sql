-- Script untuk membuat tabel edu_corner di database Neon
-- Jalankan script ini di Neon SQL Editor atau melalui psql

CREATE TABLE IF NOT EXISTS edu_corner (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  cita_cita TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC);

