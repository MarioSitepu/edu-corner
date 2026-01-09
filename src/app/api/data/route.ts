import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET - Ambil semua data
export async function GET() {
  try {
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
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table')) {
        console.log('Tabel tidak ditemukan, membuat tabel...');
        try {
          await sql`
            CREATE TABLE IF NOT EXISTS edu_corner (
              id SERIAL PRIMARY KEY,
              nama VARCHAR(255) NOT NULL,
              cita_cita TEXT NOT NULL,
              kelas VARCHAR(10),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          // Buat index
          await sql`
            CREATE INDEX IF NOT EXISTS idx_edu_corner_created_at ON edu_corner(created_at DESC)
          `;
          
          // Setelah tabel dibuat, coba ambil data lagi
          const data = await sql`
            SELECT id, nama, cita_cita, kelas, created_at 
            FROM edu_corner 
            ORDER BY created_at DESC
          `;
          
          return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
        } catch (createError: any) {
          console.error('Error creating table:', createError);
          throw new Error(`Gagal membuat tabel: ${createError.message}`);
        }
      }
      throw tableError;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error);
    const errorMessage = error.message || 'Gagal mengambil data dari database';
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
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan data' },
      { status: 500 }
    );
  }
}

