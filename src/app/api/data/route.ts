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

    // Pastikan kolom-kolom yang diperlukan ada di database
    try {
      // Cek apakah kolom karakter ada
      await sql`SELECT karakter FROM edu_corner LIMIT 1`;
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes('does not exist') || errorMsg.includes('column')) {
        console.log('Menambahkan kolom-kolom baru ke tabel...');
        try {
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
          console.log('Kolom-kolom baru berhasil ditambahkan');
        } catch (colError: any) {
          console.log('Kolom mungkin sudah ada atau error:', colError.message);
        }
      }
    }
    
    // Cek apakah tabel ada, jika tidak buat tabel
    try {
      const data = await sql`
        SELECT id, nama, karakter, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at 
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
          // Buat tabel dengan kolom lengkap (dengan karakter, tanpa kelas dan cita_cita, dengan kolom posisi terpisah)
          await sql`
            CREATE TABLE IF NOT EXISTS edu_corner (
              id SERIAL PRIMARY KEY,
              nama VARCHAR(255) NOT NULL,
              karakter VARCHAR(20),
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
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20)`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10)`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
            await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
          } catch (colError: any) {
            console.log('Kolom mungkin sudah ada:', colError.message);
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
            SELECT id, nama, karakter, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at 
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
    const { nama, karakter, mbtiCode, topCareers } = body;
    
    // Log untuk debugging
    console.log('POST /api/data - Received data:', {
      nama,
      karakter,
      mbtiCode,
      topCareersLength: topCareers?.length
    });

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
    
    // Validasi dan sanitize karakter
    const validKarakter = ['Berani', 'Ceria', 'Pintar', 'Aktif', 'Kreatif'];
    const sanitizedKarakter = karakter && typeof karakter === 'string' && validKarakter.includes(karakter.trim())
      ? karakter.trim()
      : null;
    
    // Log untuk debugging karakter
    if (!sanitizedKarakter) {
      console.warn('Karakter tidak valid atau kosong:', {
        karakter,
        type: typeof karakter,
        validKarakter
      });
    }
    
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
    
    // Validasi topCareers harus berupa array dengan minimal 1 item
    if (!topCareers || !Array.isArray(topCareers) || topCareers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data topCareers harus berupa array dengan minimal 1 item' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Validasi setiap item dalam topCareers
    for (let i = 0; i < Math.min(topCareers.length, 3); i++) {
      const career = topCareers[i];
      if (!career || typeof career !== 'object') {
        continue;
      }
      
      const careerName = career.name || '';
      const careerMatchPercent = career.matchPercent;
      
      // Validasi nama tidak boleh kosong
      if (!careerName || typeof careerName !== 'string' || careerName.trim().length === 0) {
        continue;
      }
      
      // Validasi matchPercent harus berupa number antara 0-100
      if (typeof careerMatchPercent !== 'number' || careerMatchPercent < 0 || careerMatchPercent > 100) {
        continue;
      }
      
      // Simpan ke posisi yang sesuai
      if (i === 0) {
        posisi1Nama = sanitizeInput(careerName).substring(0, 255);
        posisi1Persentase = Math.round(careerMatchPercent);
      } else if (i === 1) {
        posisi2Nama = sanitizeInput(careerName).substring(0, 255);
        posisi2Persentase = Math.round(careerMatchPercent);
      } else if (i === 2) {
        posisi3Nama = sanitizeInput(careerName).substring(0, 255);
        posisi3Persentase = Math.round(careerMatchPercent);
      }
    }
    
    // Pastikan minimal ada 1 posisi yang terisi
    if (!posisi1Nama) {
      return NextResponse.json(
        { success: false, error: 'Minimal harus ada 1 posisi cita-cita yang valid' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Pastikan kolom-kolom yang diperlukan ada di database
    // Cek dan tambahkan kolom jika belum ada (untuk tabel yang sudah ada)
    try {
      // Cek apakah kolom karakter ada
      await sql`SELECT karakter FROM edu_corner LIMIT 1`;
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes('does not exist') || errorMsg.includes('column')) {
        console.log('Menambahkan kolom-kolom baru ke tabel...');
        try {
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS mbti_code VARCHAR(10)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
          console.log('Kolom-kolom baru berhasil ditambahkan');
        } catch (colError: any) {
          console.log('Kolom mungkin sudah ada atau error:', colError.message);
        }
      }
    }
    
    // Hapus kolom lama yang tidak lagi digunakan
    // Kolom cita_cita dan kelas sudah tidak digunakan lagi, hapus jika masih ada
    try {
      // Hapus constraint NOT NULL terlebih dahulu jika ada
      await sql`ALTER TABLE edu_corner ALTER COLUMN cita_cita DROP NOT NULL`;
    } catch (e: any) {
      // Abaikan error jika kolom tidak ada atau sudah nullable
    }
    
    try {
      await sql`ALTER TABLE edu_corner ALTER COLUMN kelas DROP NOT NULL`;
    } catch (e: any) {
      // Abaikan error jika kolom tidak ada atau sudah nullable
    }
    
    // Hapus kolom lama
    try {
      await sql`ALTER TABLE edu_corner DROP COLUMN IF EXISTS cita_cita`;
      console.log('Kolom cita_cita berhasil dihapus');
    } catch (e: any) {
      console.log('Kolom cita_cita mungkin sudah dihapus atau tidak ada');
    }
    
    try {
      await sql`ALTER TABLE edu_corner DROP COLUMN IF EXISTS kelas`;
      console.log('Kolom kelas berhasil dihapus');
    } catch (e: any) {
      console.log('Kolom kelas mungkin sudah dihapus atau tidak ada');
    }
    
    // Pastikan kolom-kolom posisi juga ada (double check)
    try {
      await sql`SELECT posisi_1_nama FROM edu_corner LIMIT 1`;
    } catch (e: any) {
      const errorMsg = e?.message || String(e);
      if (errorMsg.includes('does not exist') || errorMsg.includes('column')) {
        try {
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS karakter VARCHAR(20)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_1_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_2_persentase INTEGER`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_nama VARCHAR(255)`;
          await sql`ALTER TABLE edu_corner ADD COLUMN IF NOT EXISTS posisi_3_persentase INTEGER`;
        } catch (colError: any) {
          console.log('Kolom posisi mungkin sudah ada atau error:', colError.message);
        }
      }
    }

    // Log data yang akan disimpan
    console.log('Data yang akan disimpan:', {
      sanitizedNama,
      sanitizedKarakter,
      sanitizedMbtiCode,
      posisi1Nama,
      posisi1Persentase,
      posisi2Nama,
      posisi2Persentase,
      posisi3Nama,
      posisi3Persentase
    });

    // Simpan data dengan kolom posisi terpisah
    const result = await sql`
      INSERT INTO edu_corner (
        nama, 
        karakter,
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
        ${sanitizedKarakter},
        ${sanitizedMbtiCode}, 
        ${posisi1Nama}, 
        ${posisi1Persentase}, 
        ${posisi2Nama}, 
        ${posisi2Persentase}, 
        ${posisi3Nama}, 
        ${posisi3Persentase}
      )
      RETURNING id, nama, karakter, mbti_code, posisi_1_nama, posisi_1_persentase, posisi_2_nama, posisi_2_persentase, posisi_3_nama, posisi_3_persentase, created_at
    `;

    console.log('Data berhasil disimpan:', result[0]);

    return NextResponse.json(
      { success: true, data: result[0] },
      { 
        status: 201,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error saving data:', error);
    
    // Extract error message dengan lebih baik
    let errorMessage = 'Gagal menyimpan data ke database';
    let errorDetails: any = {};
    
    if (error) {
      errorDetails = {
        message: error?.message,
        code: error?.code,
        detail: error?.detail,
        severity: error?.severity,
        name: error?.name,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      };
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.code) {
        errorMessage = `Database error: ${error.code}`;
      }
    }
    
    console.error('Error details:', errorDetails);
    
    const responseMessage = process.env.NODE_ENV === 'development'
      ? {
          success: false,
          error: errorMessage,
          details: errorDetails
        }
      : {
          success: false,
          error: 'Gagal menyimpan data. Silakan coba lagi nanti.'
        };
    
    return NextResponse.json(
      responseMessage,
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

