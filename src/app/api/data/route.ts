import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET - Ambil semua data
export async function GET() {
  try {
    // Cek koneksi database terlebih dahulu
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL tidak ditemukan');
      return NextResponse.json(
        { success: false, error: 'Konfigurasi database tidak ditemukan. Silakan cek file .env.local' },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Cek apakah tabel ada, jika tidak buat tabel
    try {
      const data = await sql`
        SELECT id, nama, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at 
        FROM edu_corner 
        ORDER BY created_at DESC
      `;
      
      return NextResponse.json(
        { success: true, data: data || [] }, 
        { 
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (tableError: any) {
      // Jika tabel tidak ada, buat tabel
      const errorMsg = tableError?.message || String(tableError);
      console.log('Error query:', errorMsg);
      
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table') || errorMsg.includes('relation "edu_corner" does not exist')) {
        console.log('Tabel tidak ditemukan, membuat tabel...');
        try {
          // Buat tabel dengan kolom lengkap (tanpa kelas dan cita_cita, dengan kolom posisi terpisah)
          await sql`
            CREATE TABLE IF NOT EXISTS edu_corner (
              id SERIAL PRIMARY KEY,
              nama VARCHAR(255) NOT NULL,
              mbti_code VARCHAR(10),
              posisi_1_nama VARCHAR(255),
              posisi_1_persentase INTEGER,
              posisi_2_nama VARCHAR(255),
              posisi_2_persentase INTEGER,
              posisi_3_nama VARCHAR(255),
              posisi_3_persentase INTEGER,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          // Cek dan tambahkan kolom jika belum ada (untuk tabel yang sudah ada)
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10)`;
          } catch (colError: any) {
            console.log('Kolom mbti_code mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
          } catch (colError: any) {
            console.log('Kolom posisi_1_nama mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
          } catch (colError: any) {
            console.log('Kolom posisi_1_persentase mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
          } catch (colError: any) {
            console.log('Kolom posisi_2_nama mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
          } catch (colError: any) {
            console.log('Kolom posisi_2_persentase mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
          } catch (colError: any) {
            console.log('Kolom posisi_3_nama mungkin sudah ada:', colError.message);
          }
          
          try {
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
          } catch (colError: any) {
            console.log('Kolom posisi_3_persentase mungkin sudah ada:', colError.message);
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
            SELECT id, nama, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at 
            FROM edu_corner 
            ORDER BY created_at DESC
          `;
          
          return NextResponse.json(
        { success: true, data: data || [] }, 
        { 
          status: 200,
          headers: corsHeaders
        }
      );
        } catch (createError: any) {
          console.error('Error creating table:', createError);
          const errorMsg = process.env.NODE_ENV === 'development' 
            ? `Gagal membuat tabel: ${createError.message}`
            : 'Gagal membuat tabel. Silakan hubungi administrator.';
          return NextResponse.json(
            { success: false, error: errorMsg },
            { 
              status: 500,
              headers: corsHeaders
            }
          );
        }
      }
      
      // Error lain selain tabel tidak ada
      console.error('Database error:', errorMsg);
      const errorMsgPublic = process.env.NODE_ENV === 'development'
        ? `Error database: ${errorMsg}`
        : 'Terjadi kesalahan pada database. Silakan coba lagi nanti.';
      return NextResponse.json(
        { success: false, error: errorMsgPublic },
        { 
          status: 500,
          headers: corsHeaders
        }
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
    const { nama, mbtiCode, topCareers } = body;

    // Validasi input
    if (!nama) {
      return NextResponse.json(
        { success: false, error: 'Nama harus diisi' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validasi panjang input
    const trimmedNama = nama.trim();

    if (trimmedNama.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nama tidak boleh kosong' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (trimmedNama.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Nama terlalu panjang (maksimal 255 karakter)' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Sanitize input - remove potential XSS characters
    const sanitizeInput = (input: string) => {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
    };

    const sanitizedNama = sanitizeInput(trimmedNama);
    
    // Validasi dan sanitize mbtiCode
    const sanitizedMbtiCode = mbtiCode && typeof mbtiCode === 'string' 
      ? sanitizeInput(mbtiCode.trim()).substring(0, 10) 
      : null;
    
    // Ekstrak data posisi dari topCareers
    let posisi1Nama = null;
    let posisi1Persentase = null;
    let posisi2Nama = null;
    let posisi2Persentase = null;
    let posisi3Nama = null;
    let posisi3Persentase = null;
    
    if (topCareers && Array.isArray(topCareers)) {
      if (topCareers.length > 0 && topCareers[0]) {
        posisi1Nama = sanitizeInput(topCareers[0].name || '').substring(0, 255);
        posisi1Persentase = typeof topCareers[0].matchPercent === 'number' ? topCareers[0].matchPercent : null;
      }
      if (topCareers.length > 1 && topCareers[1]) {
        posisi2Nama = sanitizeInput(topCareers[1].name || '').substring(0, 255);
        posisi2Persentase = typeof topCareers[1].matchPercent === 'number' ? topCareers[1].matchPercent : null;
      }
      if (topCareers.length > 2 && topCareers[2]) {
        posisi3Nama = sanitizeInput(topCareers[2].name || '').substring(0, 255);
        posisi3Persentase = typeof topCareers[2].matchPercent === 'number' ? topCareers[2].matchPercent : null;
      }
    }

    // Cek dan buat kolom jika belum ada
    try {
      await sql`SELECT mbti_code FROM edu_corner LIMIT 1`;
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes('does not exist') || errorMsg.includes('column')) {
        try {
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
        } catch (colError: any) {
          console.log('Kolom mungkin sudah ada atau error:', colError.message);
        }
      }
    }

    // Simpan data dengan kolom posisi terpisah
    const result = await sql`
      INSERT INTO edu_corner (
        nama, 
        mbti_code, 
        posisi_1_nama, 
        posisi_1_persentase, 
        posisi_2_nama, 
        posisi_2_persentase, 
        posisi_3_nama, 
        posisi_3_persentase
      )
      VALUES (
        ${sanitizedNama}, 
        ${sanitizedMbtiCode}, 
        ${posisi1Nama}, 
        ${posisi1Persentase}, 
        ${posisi2Nama}, 
        ${posisi2Persentase}, 
        ${posisi3Nama}, 
        ${posisi3Persentase}
      )
      RETURNING id, nama, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at
    `;

    return NextResponse.json(
      { success: true, data: result[0] },
      { 
        status: 201,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error saving data:', error);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error?.message || 'Gagal menyimpan data ke database')
      : 'Gagal menyimpan data. Silakan coba lagi nanti.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

