import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET - Ambil penjelasan berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID tidak valid' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const result = await sql`
      SELECT id, cita_cita, explanation, created_at, updated_at 
      FROM career_explanations 
      WHERE id = ${id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data tidak ditemukan' },
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error fetching career explanation:', error);
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

// PUT - Update penjelasan berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID tidak valid' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

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

    const result = await sql`
      UPDATE career_explanations 
      SET cita_cita = ${sanitizedCitaCita}, explanation = ${sanitizedExplanation}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, cita_cita, explanation, created_at, updated_at
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Data tidak ditemukan' },
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error updating career explanation:', error);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error?.message || 'Gagal mengupdate data di database')
      : 'Gagal mengupdate data. Silakan coba lagi nanti.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

// DELETE - Hapus penjelasan berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID tidak valid' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    await sql`
      DELETE FROM career_explanations WHERE id = ${id}
    `;

    return NextResponse.json(
      { success: true, message: 'Data berhasil dihapus' },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error: any) {
    console.error('Error deleting career explanation:', error);
    const errorMessage = process.env.NODE_ENV === 'development'
      ? (error?.message || 'Gagal menghapus data dari database')
      : 'Gagal menghapus data. Silakan coba lagi nanti.';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
