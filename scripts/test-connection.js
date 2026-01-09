// Script untuk test koneksi ke Neon Database
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL tidak ditemukan di .env.local');
    }

    console.log('🔄 Menguji koneksi ke Neon Database...');
    console.log('📍 Connection String:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

    const sql = neon(process.env.DATABASE_URL);

    // Test query sederhana
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    console.log('✅ Koneksi berhasil!');
    console.log('⏰ Waktu Server:', result[0].current_time);
    console.log('📦 PostgreSQL Version:', result[0].pg_version.split(' ')[0] + ' ' + result[0].pg_version.split(' ')[1]);

    // Cek apakah tabel sudah ada
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'edu_corner'
      ) as table_exists
    `;

    if (tableCheck[0].table_exists) {
      console.log('✅ Tabel edu_corner sudah ada');
      
      // Hitung jumlah data
      const count = await sql`SELECT COUNT(*) as total FROM edu_corner`;
      console.log('📊 Total data:', count[0].total);
    } else {
      console.log('⚠️  Tabel edu_corner belum ada');
      console.log('💡 Jalankan script create-table.sql untuk membuat tabel');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
