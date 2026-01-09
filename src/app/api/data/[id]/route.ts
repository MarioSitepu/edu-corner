import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

// DELETE - Hapus data berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID tidak valid' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM edu_corner WHERE id = ${id}
    `;

    return NextResponse.json(
      { success: true, message: 'Data berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus data' },
      { status: 500 }
    );
  }
}

