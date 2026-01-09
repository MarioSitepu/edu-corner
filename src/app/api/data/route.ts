import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET - Ambil semua data
export async function GET() {
  try {
    // Cek koneksi database terlebih dahulu
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL tidak ditemukan');
      return NextResponse.json(
        { success: false, error: 'Konfigurasi database tidak ditemukan. Silakan cek file .env.local' },
        { status: 500 }
      );
    }

    // Cek apakah tabel ada, jika tidak buat tabel
    try {
      const data = await sql`
        SELECT id, nama, cita_cita, kelas, created_at 
        FROM edu_corner 
        ORDER BY created_at DESC
      `;
      
      return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
    } catch (tableError: any) {
      // Jika tabel tidak ada, buat tabel
      const errorMsg = tableError?.message || String(tableError);
      console.log('Error query:', errorMsg);
      
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table') || errorMsg.includes('relation "edu_corner" does not exist')) {
        console.log('Tabel tidak ditemukan, membuat tabel...');
        try {
          // Buat tabel dengan kolom kelas
          await sql`
            CREATE TABLE IF NOT EXISTS edu_corner (
              id SERIAL PRIMARY KEY,
              nama VARCHAR(255) NOT NULL,
              cita_cita TEXT NOT NULL,
              kelas VARCHAR(10),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          // Cek apakah kolom kelas sudah ada, jika belum tambahkan
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS kelas VARCHAR(10)`;
          } catch (colError: any) {
            // Kolom mungkin sudah ada, abaikan error
            console.log('Kolom kelas mungkin sudah ada:', colError.message);
          }
          
          // Buat index
          try {
            await sql`
              CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC)
            `;
          } catch (idxError: any) {
            // Index mungkin sudah ada, abaikan error
            console.log('Index mungkin sudah ada:', idxError.message);
          }
          
          // Setelah tabel dibuat, coba ambil data lagi
          const data = await sql`
            SELECT id, nama, cita_cita, kelas, created_at 
            FROM edu_corner 
            ORDER BY created_at DESC
          `;
          
          return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
        } catch (createError: any) {
          console.error('Error creating table:', createError);
          return NextResponse.json(
            { success: false, error: `Gagal membuat tabel: ${createError.message}` },
            { status: 500 }
          );
        }
      }
      
      // Error lain selain tabel tidak ada
      console.error('Database error:', errorMsg);
      return NextResponse.json(
        { success: false, error: `Error database: ${errorMsg}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching data:', error);
    const errorMessage = error?.message || 'Gagal mengambil data dari database';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Simpan data baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, citaCita, kelas } = body;

    if (!nama || !citaCita) {
      return NextResponse.json(
        { success: false, error: 'Nama dan cita-cita harus diisi' },
        { status: 400 }
      );
    }

    // Jika kelas ada, simpan dengan kelas, jika tidak gunakan query tanpa kelas
    let result;
    if (kelas) {
      result = await sql`
        INSERT INTO edu_corner (nama, cita_cita, kelas)
        VALUES (${nama.trim()}, ${citaCita.trim()}, ${kelas.trim()})
        RETURNING id, nama, cita_cita, kelas, created_at
      `;
    } else {
      result = await sql`
        INSERT INTO edu_corner (nama, cita_cita)
        VALUES (${nama.trim()}, ${citaCita.trim()})
        RETURNING id, nama, cita_cita, kelas, created_at
      `;
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving data:', error);
    const errorMessage = error?.message || 'Gagal menyimpan data ke database';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

