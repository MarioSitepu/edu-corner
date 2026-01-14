import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE - Hapus data berdasarkan ID
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
      DELETE FROM edu_corner WHERE id = ${id}
    `;

    return NextResponse.json(
      { success: true, message: 'Data berhasil dihapus' },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

