import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// GET - Ambil semua data
export async function GET() {
  try {
    const data = await sql`
      SELECT id, nama, cita_cita, kelas, created_at 
      FROM edu_corner 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data' },
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

