import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET - Ambil semua penjelasan pekerjaan atau berdasarkan cita-cita
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citaCita = searchParams.get('citaCita');

    // Cek apakah tabel ada, jika tidak buat tabel
    try {
      let data;
      if (citaCita) {
        // Cari berdasarkan cita-cita
        data = await sql`
          SELECT id, cita_cita, explanation, created_at, updated_at 
          FROM career_explanations 
          WHERE LOWER(cita_cita) = LOWER(${citaCita})
          ORDER BY updated_at DESC
          LIMIT 1
        `;
      } else {
        // Ambil semua data
        data = await sql`
          SELECT id, cita_cita, explanation, created_at, updated_at 
          FROM career_explanations 
          ORDER BY updated_at DESC
        `;
      }
      
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
      
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation') || errorMsg.includes('table') || errorMsg.includes('relation "career_explanations" does not exist')) {
        console.log('Tabel tidak ditemukan, membuat tabel...');
        try {
          // Buat tabel untuk menyimpan penjelasan pekerjaan
          await sql`
            CREATE TABLE IF NOT EXISTS career_explanations (
              id SERIAL PRIMARY KEY,
              cita_cita VARCHAR(255) NOT NULL UNIQUE,
              explanation TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          // Buat index untuk pencarian cepat
          try {
            await sql`
              CREATE INDEX IF NOT EXISTS idx_career_explanations_cita_cita ON career_explanations(LOWER(cita_cita))
            `;
          } catch (idxError: any) {
            console.log('Index mungkin sudah ada:', idxError.message);
          }
          
          // Buat trigger untuk update updated_at otomatis
          try {
            await sql`
              CREATE OR REPLACE FUNCTION update_updated_at_column()
              RETURNS TRIGGER AS $$
              BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
              END;
              $$ language 'plpgsql';
            `;
            
            await sql`
              DROP TRIGGER IF EXISTS update_career_explanations_updated_at ON career_explanations;
              CREATE TRIGGER update_career_explanations_updated_at
                BEFORE UPDATE ON career_explanations
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `;
          } catch (triggerError: any) {
            console.log('Trigger mungkin sudah ada:', triggerError.message);
          }
          
          // Setelah tabel dibuat, coba ambil data lagi
          let data;
          if (citaCita) {
            data = await sql`
              SELECT id, cita_cita, explanation, created_at, updated_at 
              FROM career_explanations 
              WHERE LOWER(cita_cita) = LOWER(${citaCita})
              ORDER BY updated_at DESC
              LIMIT 1
            `;
          } else {
            data = await sql`
              SELECT id, cita_cita, explanation, created_at, updated_at 
              FROM career_explanations 
              ORDER BY updated_at DESC
            `;
          }
          
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
    console.error('Error fetching career explanations:', error);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error?.message || 'Gagal mengambil data dari database')
      : 'Gagal mengambil data. Silakan coba lagi nanti.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// POST - Simpan atau update penjelasan pekerjaan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citaCita, explanation } = body;

    // Validasi input
    if (!citaCita || !explanation) {
      return NextResponse.json(
        { success: false, error: 'Cita-cita dan penjelasan harus diisi' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validasi panjang input
    const trimmedCitaCita = citaCita.trim();
    const trimmedExplanation = explanation.trim();

    if (trimmedCitaCita.length === 0 || trimmedExplanation.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cita-cita dan penjelasan tidak boleh kosong' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (trimmedCitaCita.length > 255) {
      return NextResponse.json(
        { success: false, error: 'Cita-cita terlalu panjang (maksimal 255 karakter)' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (trimmedExplanation.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Penjelasan terlalu panjang (maksimal 5000 karakter)' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Sanitize input
    const sanitizeInput = (input: string) => {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
    };

    const sanitizedCitaCita = sanitizeInput(trimmedCitaCita);
    const sanitizedExplanation = sanitizeInput(trimmedExplanation);

    // Cek apakah sudah ada penjelasan untuk cita-cita ini
    const existing = await sql`
      SELECT id FROM career_explanations 
      WHERE LOWER(cita_cita) = LOWER(${sanitizedCitaCita})
      LIMIT 1
    `;

    let result;
    if (existing.length > 0) {
      // Update jika sudah ada
      result = await sql`
        UPDATE career_explanations 
        SET explanation = ${sanitizedExplanation}, updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(cita_cita) = LOWER(${sanitizedCitaCita})
        RETURNING id, cita_cita, explanation, created_at, updated_at
      `;
    } else {
      // Insert jika belum ada
      result = await sql`
        INSERT INTO career_explanations (cita_cita, explanation)
        VALUES (${sanitizedCitaCita}, ${sanitizedExplanation})
        RETURNING id, cita_cita, explanation, created_at, updated_at
      `;
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { 
        status: existing.length > 0 ? 200 : 201,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error saving career explanation:', error);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error?.message || 'Gagal menyimpan data ke database')
      : 'Gagal menyimpan data. Silakan coba lagi nanti.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
